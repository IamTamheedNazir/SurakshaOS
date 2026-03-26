/// SurakshaOS Filesystem Extension
/// Adds stat(), list_dir(), and the FileInfo type needed by the shell.
/// Sits on top of the existing in-memory VFS from v0.1.

use alloc::string::{String, ToString};
use alloc::vec::Vec;

// ─── types ────────────────────────────────────────────────────────────────────

#[derive(Debug, Clone)]
pub struct FileInfo {
    pub name:   String,
    pub size:   usize,
    pub is_dir: bool,
}

// ─── VFS node (internal) ──────────────────────────────────────────────────────

#[derive(Clone)]
enum VfsNode {
    File { data: Vec<u8> },
    Dir  { children: Vec<(String, VfsNode)> },
}

use spin::Mutex;

static VFS_ROOT: Mutex<Option<VfsNode>> = Mutex::new(None);

pub fn vfs_init() {
    *VFS_ROOT.lock() = Some(VfsNode::Dir { children: Vec::new() });
}

// ─── path utilities ───────────────────────────────────────────────────────────

fn split_path(path: &str) -> Vec<&str> {
    path.split('/').filter(|s| !s.is_empty()).collect()
}

// ─── public API ───────────────────────────────────────────────────────────────

pub fn create_file(path: &str) -> Result<(), &'static str> {
    write_file(path, &[])
}

pub fn create_dir(path: &str) -> Result<(), &'static str> {
    let mut root = VFS_ROOT.lock();
    let node = root.as_mut().ok_or("vfs not initialised")?;
    let parts = split_path(path);
    insert_node(node, &parts, VfsNode::Dir { children: Vec::new() })
}

pub fn write_file(path: &str, data: &[u8]) -> Result<(), &'static str> {
    let mut root = VFS_ROOT.lock();
    let node = root.as_mut().ok_or("vfs not initialised")?;
    let parts = split_path(path);
    insert_node(node, &parts, VfsNode::File { data: data.to_vec() })
}

pub fn read_file(path: &str) -> Result<Vec<u8>, &'static str> {
    let root = VFS_ROOT.lock();
    let node = root.as_ref().ok_or("vfs not initialised")?;
    let parts = split_path(path);
    match find_node(node, &parts)? {
        VfsNode::File { data } => Ok(data.clone()),
        VfsNode::Dir  { .. }   => Err("is a directory"),
    }
}

pub fn remove_file(path: &str) -> Result<(), &'static str> {
    let mut root = VFS_ROOT.lock();
    let node = root.as_mut().ok_or("vfs not initialised")?;
    let parts = split_path(path);
    delete_node(node, &parts)
}

pub fn stat(path: &str) -> Result<FileInfo, &'static str> {
    if path == "/" {
        return Ok(FileInfo { name: "/".into(), size: 0, is_dir: true });
    }
    let root  = VFS_ROOT.lock();
    let node  = root.as_ref().ok_or("vfs not initialised")?;
    let parts = split_path(path);
    let name  = parts.last().copied().unwrap_or("/").to_string();
    match find_node(node, &parts)? {
        VfsNode::File { data } => Ok(FileInfo { name, size: data.len(), is_dir: false }),
        VfsNode::Dir  { .. }   => Ok(FileInfo { name, size: 0, is_dir: true }),
    }
}

pub fn list_dir(path: &str) -> Result<Vec<FileInfo>, &'static str> {
    let root  = VFS_ROOT.lock();
    let node  = root.as_ref().ok_or("vfs not initialised")?;
    let parts = split_path(path);
    let target = if parts.is_empty() { node } else { find_node(node, &parts)? };
    match target {
        VfsNode::Dir { children } => {
            Ok(children.iter().map(|(name, child)| FileInfo {
                name:   name.clone(),
                size:   match child { VfsNode::File { data } => data.len(), _ => 0 },
                is_dir: matches!(child, VfsNode::Dir { .. }),
            }).collect())
        }
        VfsNode::File { .. } => Err("not a directory"),
    }
}

// ─── internal tree traversal ──────────────────────────────────────────────────

fn find_node<'a>(node: &'a VfsNode, parts: &[&str]) -> Result<&'a VfsNode, &'static str> {
    if parts.is_empty() { return Ok(node); }
    match node {
        VfsNode::Dir { children } => {
            let child = children.iter()
                .find(|(n, _)| n == parts[0])
                .map(|(_, c)| c)
                .ok_or("no such file or directory")?;
            find_node(child, &parts[1..])
        }
        VfsNode::File { .. } => Err("not a directory"),
    }
}

fn insert_node(node: &mut VfsNode, parts: &[&str], new: VfsNode) -> Result<(), &'static str> {
    if parts.is_empty() { return Err("empty path"); }
    match node {
        VfsNode::Dir { children } => {
            if parts.len() == 1 {
                if let Some(existing) = children.iter_mut().find(|(n, _)| n == parts[0]) {
                    existing.1 = new; // overwrite
                } else {
                    children.push((parts[0].to_string(), new));
                }
                Ok(())
            } else {
                // Walk deeper, creating dirs on the way if needed
                let child = children.iter_mut().find(|(n, _)| n == parts[0]);
                match child {
                    Some((_, c)) => insert_node(c, &parts[1..], new),
                    None => {
                        children.push((parts[0].to_string(), VfsNode::Dir { children: Vec::new() }));
                        let child = children.last_mut().unwrap();
                        insert_node(&mut child.1, &parts[1..], new)
                    }
                }
            }
        }
        VfsNode::File { .. } => Err("not a directory"),
    }
}

fn delete_node(node: &mut VfsNode, parts: &[&str]) -> Result<(), &'static str> {
    if parts.is_empty() { return Err("empty path"); }
    match node {
        VfsNode::Dir { children } => {
            if parts.len() == 1 {
                let before = children.len();
                children.retain(|(n, _)| n != parts[0]);
                if children.len() == before { Err("no such file") } else { Ok(()) }
            } else {
                let child = children.iter_mut()
                    .find(|(n, _)| n == parts[0])
                    .map(|(_, c)| c)
                    .ok_or("no such file or directory")?;
                delete_node(child, &parts[1..])
            }
        }
        VfsNode::File { .. } => Err("not a directory"),
    }
}

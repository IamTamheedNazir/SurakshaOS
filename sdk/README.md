# SurakshaOS SDK

Developer toolkit for building native SurakshaOS applications.

## Features

- **Rust-first**: Native Rust development
- **Capability-based**: Secure by default
- **Cross-platform**: RISC-V, ARM support
- **Hot reload**: Fast development cycle
- **Formal verification**: Prove your code correct

## Quick Start

### Install SDK

```bash
curl -sSf https://sdk.suraksha-os.in/install.sh | sh
```

### Create New App

```bash
suraksha-sdk new my-app
cd my-app
```

### Project Structure

```
my-app/
├── Cargo.toml          # Rust dependencies
├── src/
│   └── main.rs         # App entry point
├── resources/          # Images, fonts, etc.
└── manifest.toml       # App manifest
```

### Hello World

```rust
use suraksha_sdk::prelude::*;

#[suraksha_app]
fn main() {
    let app = App::new("Hello SurakshaOS");
    
    app.window()
        .title("My First App")
        .size(800, 600)
        .show();
    
    app.run();
}
```

### Build & Run

```bash
# Build for emulator
suraksha-sdk build

# Run in emulator
suraksha-sdk run

# Build for device
suraksha-sdk build --release --target shakti

# Install on device
suraksha-sdk install
```

## API Reference

### UI Components

```rust
use suraksha_sdk::ui::*;

Button::new("Click me")
    .on_click(|| println!("Clicked!"))
    .show();

Text::new("Hello World")
    .font_size(24)
    .color(Color::GREEN)
    .show();

Image::new("logo.png")
    .size(200, 200)
    .show();
```

### Capabilities

```rust
use suraksha_sdk::capability::*;

// Request file access
let file_cap = request_capability(
    CapabilityType::File,
    "/home/user/documents"
)?;

// Read file
let content = file_cap.read("document.txt")?;

// Write file (requires write permission)
file_cap.write("output.txt", &data)?;
```

### Networking

```rust
use suraksha_sdk::net::*;

// Request network capability
let net_cap = request_capability(
    CapabilityType::Network,
    "api.example.com"
)?;

// Make HTTP request
let response = net_cap.get("https://api.example.com/data")?;
```

### Storage

```rust
use suraksha_sdk::storage::*;

// App-specific encrypted storage
let storage = AppStorage::new()?;

// Store data (automatically encrypted)
storage.set("key", "value")?;

// Retrieve data
let value = storage.get("key")?;
```

### AI Integration

```rust
use suraksha_sdk::ai::*;

// Load on-device AI model
let model = AiModel::load(ModelType::LLaMA3_2_3B)?;

// Run inference
let response = model.infer(
    "What is the capital of India?",
    InferenceConfig::default()
)?;

println!("Response: {}", response);
```

## Examples

See `examples/` directory for complete examples:

- `hello-world/` - Basic app
- `todo-app/` - CRUD operations
- `camera-app/` - Camera access
- `ai-chat/` - On-device AI chat
- `file-manager/` - File operations

## Testing

```bash
# Run unit tests
suraksha-sdk test

# Run integration tests
suraksha-sdk test --integration

# Run with formal verification
suraksha-sdk verify
```

## Publishing

```bash
# Package app
suraksha-sdk package

# Publish to app store
suraksha-sdk publish
```

## Documentation

- **API Docs**: https://docs.suraksha-os.in/sdk
- **Tutorials**: https://docs.suraksha-os.in/tutorials
- **Examples**: https://github.com/SurakshaOS/examples

## Support

- **Discord**: https://discord.gg/suraksha-os
- **Forum**: https://forum.suraksha-os.in
- **Email**: sdk@suraksha-os.in

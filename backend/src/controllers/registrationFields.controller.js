const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * @desc    Get all registration fields
 * @route   GET /api/admin/registration-fields
 * @access  Admin
 */
exports.getAllFields = async (req, res) => {
  try {
    const { category, enabled } = req.query;
    
    let query = 'SELECT * FROM registration_fields WHERE 1=1';
    const params = [];
    
    if (category) {
      query += ' AND field_category = ?';
      params.push(category);
    }
    
    if (enabled !== undefined) {
      query += ' AND is_enabled = ?';
      params.push(enabled === 'true');
    }
    
    query += ' ORDER BY display_order ASC';
    
    const [fields] = await db.query(query, params);
    
    res.status(200).json({
      success: true,
      count: fields.length,
      data: fields
    });
  } catch (error) {
    console.error('Get all fields error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registration fields',
      error: error.message
    });
  }
};

/**
 * @desc    Get all field groups with fields
 * @route   GET /api/admin/registration-fields/groups
 * @access  Admin
 */
exports.getAllGroups = async (req, res) => {
  try {
    // Get all groups
    const [groups] = await db.query(`
      SELECT * FROM registration_field_groups 
      WHERE is_enabled = true 
      ORDER BY display_order ASC
    `);
    
    // Get all fields with group mapping
    const [fields] = await db.query(`
      SELECT 
        rf.*,
        rfgm.group_id,
        rfgm.display_order as group_display_order
      FROM registration_fields rf
      LEFT JOIN registration_field_group_mapping rfgm ON rf.id = rfgm.field_id
      WHERE rf.is_enabled = true
      ORDER BY rfgm.display_order ASC, rf.display_order ASC
    `);
    
    // Group fields by group_id
    const groupedData = groups.map(group => ({
      ...group,
      fields: fields.filter(field => field.group_id === group.id)
    }));
    
    res.status(200).json({
      success: true,
      count: groupedData.length,
      data: groupedData
    });
  } catch (error) {
    console.error('Get all groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching field groups',
      error: error.message
    });
  }
};

/**
 * @desc    Get single registration field
 * @route   GET /api/admin/registration-fields/:id
 * @access  Admin
 */
exports.getFieldById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [fields] = await db.query(
      'SELECT * FROM registration_fields WHERE id = ?',
      [id]
    );
    
    if (fields.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration field not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: fields[0]
    });
  } catch (error) {
    console.error('Get field by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registration field',
      error: error.message
    });
  }
};

/**
 * @desc    Create new registration field
 * @route   POST /api/admin/registration-fields
 * @access  Admin
 */
exports.createField = async (req, res) => {
  try {
    const {
      field_name,
      field_label,
      field_type,
      field_category,
      field_options,
      placeholder,
      help_text,
      validation_rules,
      is_required,
      is_enabled,
      display_order,
      min_length,
      max_length,
      file_types,
      max_file_size,
      group_id
    } = req.body;
    
    // Validate required fields
    if (!field_name || !field_label || !field_type || !field_category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    const fieldId = uuidv4();
    
    // Insert field
    await db.query(
      `INSERT INTO registration_fields (
        id, field_name, field_label, field_type, field_category,
        field_options, placeholder, help_text, validation_rules,
        is_required, is_enabled, display_order, min_length, max_length,
        file_types, max_file_size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fieldId, field_name, field_label, field_type, field_category,
        JSON.stringify(field_options), placeholder, help_text,
        JSON.stringify(validation_rules), is_required, is_enabled,
        display_order, min_length, max_length, file_types, max_file_size
      ]
    );
    
    // Map to group if provided
    if (group_id) {
      await db.query(
        `INSERT INTO registration_field_group_mapping (id, field_id, group_id, display_order)
         VALUES (?, ?, ?, ?)`,
        [uuidv4(), fieldId, group_id, display_order || 0]
      );
    }
    
    // Fetch created field
    const [fields] = await db.query(
      'SELECT * FROM registration_fields WHERE id = ?',
      [fieldId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Registration field created successfully',
      data: fields[0]
    });
  } catch (error) {
    console.error('Create field error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating registration field',
      error: error.message
    });
  }
};

/**
 * @desc    Update registration field
 * @route   PUT /api/admin/registration-fields/:id
 * @access  Admin
 */
exports.updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if field exists
    const [existingFields] = await db.query(
      'SELECT * FROM registration_fields WHERE id = ?',
      [id]
    );
    
    if (existingFields.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration field not found'
      });
    }
    
    // Build update query
    const updateFields = [];
    const updateValues = [];
    
    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && updateData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        if (key === 'field_options' || key === 'validation_rules') {
          updateValues.push(JSON.stringify(updateData[key]));
        } else {
          updateValues.push(updateData[key]);
        }
      }
    });
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    updateValues.push(id);
    
    await db.query(
      `UPDATE registration_fields SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    // Fetch updated field
    const [fields] = await db.query(
      'SELECT * FROM registration_fields WHERE id = ?',
      [id]
    );
    
    res.status(200).json({
      success: true,
      message: 'Registration field updated successfully',
      data: fields[0]
    });
  } catch (error) {
    console.error('Update field error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating registration field',
      error: error.message
    });
  }
};

/**
 * @desc    Delete registration field
 * @route   DELETE /api/admin/registration-fields/:id
 * @access  Admin
 */
exports.deleteField = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if field exists
    const [existingFields] = await db.query(
      'SELECT * FROM registration_fields WHERE id = ?',
      [id]
    );
    
    if (existingFields.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration field not found'
      });
    }
    
    // Delete field (cascade will delete mappings)
    await db.query('DELETE FROM registration_fields WHERE id = ?', [id]);
    
    res.status(200).json({
      success: true,
      message: 'Registration field deleted successfully'
    });
  } catch (error) {
    console.error('Delete field error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting registration field',
      error: error.message
    });
  }
};

/**
 * @desc    Toggle field enabled/disabled
 * @route   PUT /api/admin/registration-fields/:id/toggle
 * @access  Admin
 */
exports.toggleField = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get current status
    const [fields] = await db.query(
      'SELECT is_enabled FROM registration_fields WHERE id = ?',
      [id]
    );
    
    if (fields.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration field not found'
      });
    }
    
    const newStatus = !fields[0].is_enabled;
    
    // Update status
    await db.query(
      'UPDATE registration_fields SET is_enabled = ? WHERE id = ?',
      [newStatus, id]
    );
    
    res.status(200).json({
      success: true,
      message: `Field ${newStatus ? 'enabled' : 'disabled'} successfully`,
      data: { is_enabled: newStatus }
    });
  } catch (error) {
    console.error('Toggle field error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling field status',
      error: error.message
    });
  }
};

/**
 * @desc    Reorder registration fields
 * @route   PUT /api/admin/registration-fields/reorder
 * @access  Admin
 */
exports.reorderFields = async (req, res) => {
  try {
    const { fields } = req.body; // Array of { id, display_order }
    
    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fields array'
      });
    }
    
    // Update display order for each field
    const promises = fields.map(field =>
      db.query(
        'UPDATE registration_fields SET display_order = ? WHERE id = ?',
        [field.display_order, field.id]
      )
    );
    
    await Promise.all(promises);
    
    res.status(200).json({
      success: true,
      message: 'Fields reordered successfully'
    });
  } catch (error) {
    console.error('Reorder fields error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering fields',
      error: error.message
    });
  }
};

/**
 * @desc    Create new field group
 * @route   POST /api/admin/registration-fields/groups
 * @access  Admin
 */
exports.createGroup = async (req, res) => {
  try {
    const { group_name, group_label, description, icon, display_order, is_enabled } = req.body;
    
    if (!group_name || !group_label) {
      return res.status(400).json({
        success: false,
        message: 'Please provide group name and label'
      });
    }
    
    const groupId = uuidv4();
    
    await db.query(
      `INSERT INTO registration_field_groups (id, group_name, group_label, description, icon, display_order, is_enabled)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [groupId, group_name, group_label, description, icon, display_order || 0, is_enabled !== false]
    );
    
    const [groups] = await db.query(
      'SELECT * FROM registration_field_groups WHERE id = ?',
      [groupId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Field group created successfully',
      data: groups[0]
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating field group',
      error: error.message
    });
  }
};

/**
 * @desc    Update field group
 * @route   PUT /api/admin/registration-fields/groups/:id
 * @access  Admin
 */
exports.updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [existingGroups] = await db.query(
      'SELECT * FROM registration_field_groups WHERE id = ?',
      [id]
    );
    
    if (existingGroups.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Field group not found'
      });
    }
    
    const updateFields = [];
    const updateValues = [];
    
    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && updateData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updateData[key]);
      }
    });
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    updateValues.push(id);
    
    await db.query(
      `UPDATE registration_field_groups SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    const [groups] = await db.query(
      'SELECT * FROM registration_field_groups WHERE id = ?',
      [id]
    );
    
    res.status(200).json({
      success: true,
      message: 'Field group updated successfully',
      data: groups[0]
    });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating field group',
      error: error.message
    });
  }
};

/**
 * @desc    Delete field group
 * @route   DELETE /api/admin/registration-fields/groups/:id
 * @access  Admin
 */
exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [existingGroups] = await db.query(
      'SELECT * FROM registration_field_groups WHERE id = ?',
      [id]
    );
    
    if (existingGroups.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Field group not found'
      });
    }
    
    await db.query('DELETE FROM registration_field_groups WHERE id = ?', [id]);
    
    res.status(200).json({
      success: true,
      message: 'Field group deleted successfully'
    });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting field group',
      error: error.message
    });
  }
};

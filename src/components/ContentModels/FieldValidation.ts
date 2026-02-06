import { FieldDefinition, ContentModel } from '../../types';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate a single field value against its definition
 */
export function validateField(
  field: FieldDefinition,
  value: any
): string | null {
  // Required check — handle structured types (button/array) separately
  if (field.field_type === 'button') {
    if (field.required && (!value || typeof value !== 'object' || (!value.text && !value.url))) {
      return `${field.name} is required`;
    }
    if (!value || typeof value !== 'object') return null;
  } else if (field.field_type === 'array') {
    if (field.required && (!Array.isArray(value) || value.length === 0)) {
      return `${field.name} must have at least one item`;
    }
    return null;
  } else if (field.field_type === 'media') {
    // Media can be a plain URL string (legacy) or { url, photographer, route }
    const mediaUrl = typeof value === 'string' ? value : (value?.url || '');
    if (field.required && !mediaUrl) {
      return `${field.name} is required`;
    }
    if (!mediaUrl) return null;
  } else {
    if (field.required && !value && value !== 0 && value !== false) {
      return `${field.name} is required`;
    }
    if (!value && value !== 0 && value !== false) {
      return null;
    }
  }

  // Type-specific validation
  switch (field.field_type) {
    case 'short_text':
    case 'long_text':
    case 'rich_text':
      if (typeof value === 'string') {
        const len = value.length;
        if (field.validation?.min_length && len < field.validation.min_length) {
          return `${field.name} must be at least ${field.validation.min_length} characters`;
        }
        if (field.validation?.max_length && len > field.validation.max_length) {
          return `${field.name} must be no more than ${field.validation.max_length} characters`;
        }
        if (field.validation?.pattern) {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(value)) {
            return `${field.name} format is invalid`;
          }
        }
      }
      break;

    case 'number':
      if (typeof value === 'number') {
        if (field.validation?.min_value !== undefined && value < field.validation.min_value) {
          return `${field.name} must be at least ${field.validation.min_value}`;
        }
        if (field.validation?.max_value !== undefined && value > field.validation.max_value) {
          return `${field.name} must be no more than ${field.validation.max_value}`;
        }
      }
      break;

    case 'boolean':
      // Boolean fields are always valid
      break;

    case 'date':
      // Basic date validation - check if it's a valid date string
      if (typeof value === 'string' && isNaN(Date.parse(value))) {
        return `${field.name} must be a valid date`;
      }
      break;

    case 'media': {
      // Media fields can be a plain URL string (legacy) or { url, photographer, route }
      let mediaUrl: string | null = null;
      if (typeof value === 'string') {
        mediaUrl = value;
      } else if (typeof value === 'object' && value !== null && typeof value.url === 'string') {
        mediaUrl = value.url;
      }
      if (mediaUrl && mediaUrl.length > 0) {
        try {
          new URL(mediaUrl);
        } catch {
          if (!mediaUrl.startsWith('/')) {
            return `${field.name} must be a valid URL`;
          }
        }
      }
      break;
    }

    case 'reference':
      // References should be UUIDs
      if (typeof value === 'string' && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
        return `${field.name} must be a valid reference`;
      }
      break;

    case 'button':
      if (field.required && typeof value === 'object' && value !== null) {
        if (!value.text || !value.url) {
          return `${field.name} requires both a label and a URL`;
        }
      }
      break;

    case 'array':
      if (field.required && (!Array.isArray(value) || value.length === 0)) {
        return `${field.name} must have at least one item`;
      }
      break;
  }

  return null;
}

/**
 * Validate all fields in a form against a content model
 */
export function validateAllFields(
  model: ContentModel,
  formData: Record<string, any>
): ValidationError[] {
  const errors: ValidationError[] = [];

  model.fields.forEach(field => {
    const value = formData[field.api_identifier];
    const error = validateField(field, value);
    if (error) {
      errors.push({
        field: field.api_identifier,
        message: error
      });
    }
  });

  return errors;
}

/**
 * Validate API identifier format
 */
export function validateApiIdentifier(identifier: string): string | null {
  if (!identifier) return 'API identifier is required';
  if (!/^[a-z][a-z0-9_]*$/.test(identifier)) {
    return 'API identifier must start with a lowercase letter and contain only lowercase letters, numbers, and underscores';
  }
  if (identifier.length < 2) return 'API identifier must be at least 2 characters';
  if (identifier.length > 50) return 'API identifier must be no more than 50 characters';
  return null;
}

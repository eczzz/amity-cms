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
  // Required check
  if (field.required && !value && value !== 0 && value !== false) {
    return `${field.name} is required`;
  }

  // Skip validation if field is empty and not required
  if (!value && value !== 0 && value !== false) {
    return null;
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

    case 'media':
    case 'reference':
      // These should be UUIDs - basic format check
      if (typeof value === 'string' && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
        return `${field.name} must be a valid reference`;
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

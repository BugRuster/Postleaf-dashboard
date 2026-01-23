# Design Document: Advertisement Content Display Fix

## Overview

This design addresses the data structure mismatch between the backend API response and the frontend Content interface in the advertisement management system. The solution introduces a transformation layer that maps the API's response structure to the frontend's expected interface, ensuring proper display of promotable content in the admin dashboard.

The core approach is to:
1. Define TypeScript interfaces that accurately represent the API response structure
2. Create a transformation function that maps API fields to frontend interface fields
3. Handle edge cases and provide sensible defaults for missing or invalid data
4. Integrate the transformation seamlessly into the existing API client

## Architecture

### Current Architecture

```
API Endpoint (/d/ads/available)
    ↓
apiClient.get<Content[]>()  ← Assumes response.data is Content[]
    ↓
Frontend Component (AvailableContent.tsx)
```

**Problem**: The API returns a wrapped response with structure `{ status, message, data: [] }` where the `data` array contains objects with different field names than the Content interface expects.

### Proposed Architecture

```
API Endpoint (/d/ads/available)
    ↓
apiClient.get<ApiAvailableContentResponse>()
    ↓
transformApiContentToContent()  ← New transformation layer
    ↓
Content[]
    ↓
Frontend Component (AvailableContent.tsx)
```

**Solution**: Introduce explicit type definitions for the API response and a transformation function that handles the mapping between API structure and frontend interface.

## Components and Interfaces

### 1. API Response Type Definitions

**Location**: `lib/api/ads.ts`

```typescript
/**
 * Raw content item structure as returned by the API
 */
interface ApiContentItem {
  _id: string;
  user_id: string;
  caption: string;
  type: string;
  image_url: string[];
  tags: string[];
  TTL: number;
  is_advertisement: boolean;
  interests: string[];
  location: string;
  isBlocked: boolean;
  blockedBy: string[];
  replies: string[];
  mentions: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  views: number;
}

/**
 * API response wrapper for available content endpoint
 */
interface ApiAvailableContentResponse {
  status: string;
  message: string;
  data: ApiContentItem[];
}
```

**Rationale**: These interfaces provide type safety when working with the raw API response, enabling TypeScript to catch errors at compile time and providing autocomplete support.

### 2. Content Type Mapping

**Location**: `lib/api/ads.ts`

```typescript
/**
 * Maps API content type strings to frontend Content type union
 */
function mapContentType(apiType: string): Content['type'] {
  const normalizedType = apiType.toLowerCase();
  
  switch (normalizedType) {
    case 'cut':
      return 'cut';
    case 'event':
      return 'event';
    case 'text':
    case 'image':
    case 'post':
    default:
      return 'post';
  }
}
```

**Rationale**: The API uses string types like "text" and "image" while the frontend expects a strict union type. This function provides a centralized mapping with a safe default fallback.

### 3. Transformation Function

**Location**: `lib/api/ads.ts`

```typescript
/**
 * Transforms API content item to frontend Content interface
 */
function transformApiContentToContent(apiContent: ApiContentItem): Content {
  return {
    id: apiContent._id,
    type: mapContentType(apiContent.type),
    title: apiContent.caption,
    description: apiContent.caption,
    author: apiContent.user_id,
    createdAt: apiContent.createdAt,
    isPromotable: apiContent.is_advertisement === false,
  };
}
```

**Rationale**: This function encapsulates all mapping logic in one place, making it easy to maintain and test. It handles:
- Field name differences (`_id` → `id`, `user_id` → `author`)
- Field reuse (`caption` → both `title` and `description`)
- Type transformation (string type → union type)
- Boolean logic inversion (`is_advertisement: false` → `isPromotable: true`)

### 4. Updated API Client Function

**Location**: `lib/api/ads.ts`

```typescript
/**
 * Fetches content available for promotion
 * @returns Promise with array of promotable content
 */
export async function getAvailableContent(): Promise<Content[]> {
  try {
    const response = await apiClient.get<ApiAvailableContentResponse>('/d/ads/available');
    
    // Handle missing or invalid response structure
    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      console.warn('Invalid API response structure for available content');
      return [];
    }
    
    // Transform each API content item to frontend Content interface
    return response.data.data
      .map(apiContent => {
        try {
          return transformApiContentToContent(apiContent);
        } catch (error) {
          console.error('Failed to transform content item:', apiContent, error);
          return null;
        }
      })
      .filter((content): content is Content => content !== null);
      
  } catch (error) {
    console.error('Failed to fetch available content:', error);
    throw error;
  }
}
```

**Rationale**: The updated function:
- Uses the correct response type (`ApiAvailableContentResponse`)
- Validates the response structure before processing
- Transforms each item individually with error handling
- Filters out any items that failed transformation
- Maintains the existing error handling behavior for the component

## Data Models

### Frontend Content Interface (Existing)

```typescript
export interface Content {
  id: string;                           // Unique identifier
  type: 'post' | 'cut' | 'event';      // Content type (strict union)
  title: string;                        // Display title
  description: string;                  // Content description
  author: string;                       // User ID of content creator
  createdAt: string;                    // ISO timestamp
  isPromotable: boolean;                // Whether content can be promoted
}
```

### API Content Item (New)

```typescript
interface ApiContentItem {
  _id: string;                    // MongoDB ObjectId
  user_id: string;                // Creator's user ID
  caption: string;                // Content text/caption
  type: string;                   // Content type (flexible string)
  image_url: string[];            // Associated images
  tags: string[];                 // Content tags
  TTL: number;                    // Time to live in milliseconds
  is_advertisement: boolean;      // Whether already an ad
  interests: string[];            // Interest categories
  location: string;               // Geographic location
  isBlocked: boolean;             // Moderation status
  blockedBy: string[];            // Users who blocked this
  replies: string[];              // Reply IDs
  mentions: string[];             // Mentioned user IDs
  createdAt: string;              // ISO timestamp
  updatedAt: string;              // ISO timestamp
  __v: number;                    // MongoDB version key
  views: number;                  // View count
}
```

### Field Mapping Table

| API Field | Frontend Field | Transformation |
|-----------|---------------|----------------|
| `_id` | `id` | Direct copy |
| `user_id` | `author` | Direct copy |
| `caption` | `title` | Direct copy |
| `caption` | `description` | Direct copy (reused) |
| `type` | `type` | Mapped via `mapContentType()` |
| `createdAt` | `createdAt` | Direct copy |
| `is_advertisement` | `isPromotable` | Boolean inversion: `false` → `true` |

**Note**: Other API fields (`image_url`, `tags`, `TTL`, etc.) are not currently needed by the frontend interface and are not mapped.


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Complete Field Mapping

*For any* valid API content item with all required fields (`_id`, `user_id`, `caption`, `type`, `createdAt`, `is_advertisement`), transforming it should produce a Content object where:
- `id` equals the original `_id`
- `author` equals the original `user_id`
- `title` equals the original `caption`
- `description` equals the original `caption`
- `createdAt` equals the original `createdAt` (preserved exactly)
- `type` is a valid Content type ('post', 'cut', or 'event')
- `isPromotable` is a boolean

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 6.1**

### Property 2: Response Structure Extraction

*For any* API response with structure `{ status: "success", message: string, data: ApiContentItem[] }`, calling `getAvailableContent()` should return an array with the same length as the `data` array (assuming all items are valid).

**Validates: Requirements 1.1, 1.2**

### Property 3: Type Mapping Fallback

*For any* API content item with an unrecognized or invalid `type` value (not 'cut', 'event', 'text', 'image', or 'post'), the transformed Content should have `type: 'post'`.

**Validates: Requirements 3.5**

### Property 4: Boolean Inversion Logic

*For any* API content item, the transformed Content's `isPromotable` field should be the logical inverse of the API's `is_advertisement` field:
- When `is_advertisement` is `false`, `isPromotable` should be `true`
- When `is_advertisement` is `true`, `isPromotable` should be `false`

**Validates: Requirements 4.1, 4.2**

### Property 5: Robustness to Extra Fields

*For any* API content item with additional fields beyond the expected schema, the transformation should succeed without errors and produce a valid Content object with all required fields properly mapped.

**Validates: Requirements 6.2**

### Property 6: Graceful Error Handling

*For any* API content item that is missing required fields or has invalid data, the transformation process should not throw an error, and the item should be filtered out from the final result array, returning only valid Content objects.

**Validates: Requirements 7.3, 7.4**

### Property 7: Empty Input Handling

*For any* empty API response data array, `getAvailableContent()` should return an empty array without throwing errors.

**Validates: Requirements 7.1**

## Error Handling

### API Response Validation

The `getAvailableContent()` function implements defensive validation:

1. **Structure Validation**: Checks that `response.data.data` exists and is an array
2. **Fallback**: Returns empty array if structure is invalid
3. **Logging**: Warns when invalid structure is encountered

```typescript
if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
  console.warn('Invalid API response structure for available content');
  return [];
}
```

### Individual Item Transformation

Each content item is transformed individually with error isolation:

1. **Try-Catch per Item**: Each transformation is wrapped in error handling
2. **Null Filtering**: Failed transformations return `null` and are filtered out
3. **Logging**: Errors are logged with the problematic item for debugging

```typescript
.map(apiContent => {
  try {
    return transformApiContentToContent(apiContent);
  } catch (error) {
    console.error('Failed to transform content item:', apiContent, error);
    return null;
  }
})
.filter((content): content is Content => content !== null);
```

### Type Safety

TypeScript provides compile-time error prevention:

1. **Strict Interfaces**: Both API and frontend interfaces are strictly typed
2. **Type Guards**: The filter uses a type predicate to ensure type safety
3. **Union Types**: Content type uses a strict union preventing invalid values

### Error Propagation

Network and unexpected errors are propagated to the component:

1. **Catch Block**: Top-level try-catch in `getAvailableContent()`
2. **Re-throw**: Errors are logged and re-thrown for component handling
3. **Component Handling**: Existing error state in `AvailableContent.tsx` displays user-friendly messages

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Together, these approaches provide comprehensive coverage where unit tests catch concrete bugs and property tests verify general correctness.

### Property-Based Testing

**Library**: We will use **fast-check** for TypeScript property-based testing.

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property reference
- Tag format: `Feature: ads-content-display-fix, Property {number}: {property_text}`

**Property Test Coverage**:

1. **Property 1 - Complete Field Mapping**
   - Generate random valid API content items
   - Transform each item
   - Assert all field mappings are correct

2. **Property 2 - Response Structure Extraction**
   - Generate random API responses with varying data array lengths
   - Mock the API client
   - Assert returned array length matches input data length

3. **Property 3 - Type Mapping Fallback**
   - Generate random invalid type strings
   - Transform content with these types
   - Assert result type is always 'post'

4. **Property 4 - Boolean Inversion Logic**
   - Generate random API content with both true and false for `is_advertisement`
   - Transform each item
   - Assert `isPromotable` is always the inverse

5. **Property 5 - Robustness to Extra Fields**
   - Generate valid API content with random additional fields
   - Transform each item
   - Assert transformation succeeds and required fields are correct

6. **Property 6 - Graceful Error Handling**
   - Generate API content items with missing required fields
   - Transform the array
   - Assert no errors thrown and invalid items are filtered out

7. **Property 7 - Empty Input Handling**
   - Test with empty data array
   - Assert returns empty array without errors

### Unit Testing

**Unit Test Coverage**:

1. **Type Mapping Examples** (Requirements 3.1-3.4)
   - Test `type: "text"` → `"post"`
   - Test `type: "image"` → `"post"`
   - Test `type: "cut"` → `"cut"`
   - Test `type: "event"` → `"event"`

2. **Edge Cases**
   - Malformed response structure (missing `data` field) → empty array
   - Null/undefined response → empty array
   - Missing `is_advertisement` field → `isPromotable: false`
   - Null/undefined values for optional fields → appropriate defaults

3. **Integration Test**
   - Mock API endpoint with real response structure
   - Call `getAvailableContent()`
   - Assert returned Content array matches expected transformation

### Test Organization

```
lib/api/__tests__/
  ├── ads.test.ts              # Unit tests for API functions
  └── ads.properties.test.ts   # Property-based tests
```

### Testing Tools

- **Jest**: Test runner and assertion library
- **fast-check**: Property-based testing library
- **MSW (Mock Service Worker)**: API mocking for integration tests

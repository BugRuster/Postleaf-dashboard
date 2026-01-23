# Implementation Plan: Advertisement Content Display Fix

## Overview

This implementation plan addresses the data structure mismatch between the backend API and frontend interface by introducing proper TypeScript types and a transformation layer. The approach is incremental: define types, implement transformation logic, add error handling, integrate into the API client, and validate with comprehensive tests.

## Tasks

- [x] 1. Define API response type interfaces
  - Create `ApiContentItem` interface matching the actual API response structure
  - Create `ApiAvailableContentResponse` interface for the wrapper response
  - Add these interfaces to `lib/api/ads.ts` before the existing `Content` interface
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 2. Implement content type mapping function
  - [x] 2.1 Create `mapContentType()` helper function
    - Implement switch statement to map API type strings to Content type union
    - Handle cases: 'text' → 'post', 'image' → 'post', 'cut' → 'cut', 'event' → 'event'
    - Default to 'post' for unrecognized types
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 2.2 Write unit tests for type mapping
    - Test each specific type mapping case
    - Test default fallback behavior
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3. Implement transformation function
  - [x] 3.1 Create `transformApiContentToContent()` function
    - Map all required fields: `_id` → `id`, `user_id` → `author`, `caption` → `title` and `description`
    - Use `mapContentType()` for type transformation
    - Implement boolean inversion: `is_advertisement: false` → `isPromotable: true`
    - Preserve `createdAt` timestamp exactly
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 4.2, 6.1_
  
  - [ ]* 3.2 Write property test for complete field mapping
    - **Property 1: Complete Field Mapping**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 6.1**
  
  - [ ]* 3.3 Write property test for boolean inversion
    - **Property 4: Boolean Inversion Logic**
    - **Validates: Requirements 4.1, 4.2**

- [ ] 4. Update getAvailableContent() function with transformation
  - [x] 4.1 Update function signature and response type
    - Change generic type from `Content[]` to `ApiAvailableContentResponse`
    - Add response structure validation
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 4.2 Implement transformation with error handling
    - Add try-catch wrapper around transformation logic
    - Map each API content item using `transformApiContentToContent()`
    - Wrap individual transformations in try-catch to isolate errors
    - Filter out null results from failed transformations
    - Add console logging for errors and warnings
    - _Requirements: 6.2, 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 4.3 Write property test for response structure extraction
    - **Property 2: Response Structure Extraction**
    - **Validates: Requirements 1.1, 1.2**
  
  - [ ]* 4.4 Write property test for graceful error handling
    - **Property 6: Graceful Error Handling**
    - **Validates: Requirements 7.3, 7.4**

- [-] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 6. Add comprehensive property-based tests
  - [ ]* 6.1 Write property test for type mapping fallback
    - **Property 3: Type Mapping Fallback**
    - **Validates: Requirements 3.5**
  
  - [ ]* 6.2 Write property test for robustness to extra fields
    - **Property 5: Robustness to Extra Fields**
    - **Validates: Requirements 6.2**
  
  - [ ]* 6.3 Write property test for empty input handling
    - **Property 7: Empty Input Handling**
    - **Validates: Requirements 7.1**

- [ ]* 7. Add edge case unit tests
  - [ ]* 7.1 Test malformed response structure
    - Test missing `data` field returns empty array
    - Test null/undefined response returns empty array
    - _Requirements: 1.3, 7.2_
  
  - [ ]* 7.2 Test missing optional fields
    - Test missing `is_advertisement` defaults to `isPromotable: false`
    - Test null/undefined values for optional fields
    - _Requirements: 4.3, 6.3_

- [ ]* 8. Add integration test
  - Mock the API endpoint with real response structure
  - Call `getAvailableContent()` and verify transformation
  - Test that the component receives correctly formatted Content array
  - _Requirements: All_

- [ ] 9. Final checkpoint - Verify UI displays content correctly
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests should run with minimum 100 iterations
- All property tests must be tagged with: `Feature: ads-content-display-fix, Property {number}: {property_text}`
- The transformation layer is purely functional and doesn't modify the API client's error handling behavior
- Existing component error handling in `AvailableContent.tsx` remains unchanged

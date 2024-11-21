// User (Parents/Guardians)
interface User {
    userId: string;           // Primary Key
    email: string;           // Unique
    firstName: string;
    lastName: string;
    role: 'parent' | 'guardian';
    familyId: string;        // References Family
    createdAt: string;
    updatedAt: string;
    passwordHash?: string;    // If using email/password auth
  }
  
  // Family
  interface Family {
    familyId: string;        // Primary Key
    name: string;            // e.g., "Smith Family"
    createdAt: string;
    updatedAt: string;
  }
  
  // Child
  interface Child {
    childId: string;         // Primary Key
    familyId: string;        // References Family
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Temperature Reading
  interface Temperature{
    temperatureId: string;       // Primary Key
    childId: string;         // References Child
    familyId: string;        // References Family
    temperature: number;
    timestamp: string;
    takenBy: string;         // References User who took the reading
    notes?: string;
    hasImage: boolean;
    imageId?: string;        // References Image (if exists)
  }
  
  // Image
  interface Image {
    imageId: string;         // Primary Key
    childId: string;         // References Child
    familyId: string;        // References Family
    userId: string;          // References User who uploaded
    fileName: string;
    s3Url: string;
    temperature?: string;    // Temperature at time of image
    uploadTimestamp: string;
  }
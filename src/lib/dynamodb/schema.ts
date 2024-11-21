export const TableSchemas = {
    Users: {
      TableName: 'Users',
      KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'ByEmail',
          KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' }
        },
        {
          IndexName: 'ByFamily',
          KeySchema: [{ AttributeName: 'familyId', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' }
        }
      ]
    },
  
    Families: {
      TableName: 'Families',
      KeySchema: [
        { AttributeName: 'familyId', KeyType: 'HASH' }
      ]
    },
  
    Children: {
      TableName: 'Children',
      KeySchema: [
        { AttributeName: 'childId', KeyType: 'HASH' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'ByFamily',
          KeySchema: [{ AttributeName: 'familyId', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' }
        }
      ]
    },
  
    TemperatureReadings: {
      TableName: 'TemperatureReadings',
      KeySchema: [
        { AttributeName: 'readingId', KeyType: 'HASH' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'ByChild',
          KeySchema: [
            { AttributeName: 'childId', KeyType: 'HASH' },
            { AttributeName: 'timestamp', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' }
        },
        {
          IndexName: 'ByFamily',
          KeySchema: [
            { AttributeName: 'familyId', KeyType: 'HASH' },
            { AttributeName: 'timestamp', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' }
        }
      ]
    },
  
    Images: {
      TableName: 'Images',
      KeySchema: [
        { AttributeName: 'imageId', KeyType: 'HASH' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'ByChild',
          KeySchema: [
            { AttributeName: 'childId', KeyType: 'HASH' },
            { AttributeName: 'uploadTimestamp', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' }
        },
        {
          IndexName: 'ByFamily',
          KeySchema: [
            { AttributeName: 'familyId', KeyType: 'HASH' },
            { AttributeName: 'uploadTimestamp', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' }
        }
      ]
    }
  };
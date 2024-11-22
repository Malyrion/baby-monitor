import { v4 as uuidv4 } from 'uuid';

class MockDynamoDB {
  constructor() {
    this.data = [];
  }

  async putItem(item) {
    item.id = uuidv4();
    this.data.push(item);
    return item;
  }

  async getItem(id) {
    return this.data.find(item => item.id === id);
  }

  async scan() {
    return this.data;
  }
}

const mockDB = new MockDynamoDB();

export default mockDB;
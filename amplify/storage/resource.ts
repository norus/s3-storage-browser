import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 's3uploadbucket',
  access: (allow) => ({
    '/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ]
  })
});
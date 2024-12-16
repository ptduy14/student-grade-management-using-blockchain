export function extractDomain(email: string) {
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw new Error('Invalid email address');
    }
  
    // Tách domain sau dấu '@'
    const domain = email.split('@')[1];
    
    return domain;
  }
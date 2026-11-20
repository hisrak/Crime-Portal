// JWT ka secret ek hi jagah rakha hai (pehle 2 files mein likha hua tha).
// Real project mein isay .env se lo: JWT_SECRET=koi_lamba_random_text
// Abhi purani value fallback hai, taake pehle ke login tokens kharab na hon.
export const JWT_SECRET = process.env.JWT_SECRET || 'IsrarBadshah'
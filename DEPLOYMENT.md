# Deployment Guide

## Option 1: Vercel (Recommended - 5 minutes)

### Step 1: Prepare Your Project
```bash
# Make sure all files are committed
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Set Framework Preset to "Next.js"
5. Add Environment Variables:
   - `DATABASE_URL` = your PostgreSQL connection string
   - `NEXTAUTH_SECRET` = a random secret string (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = `https://your-project.vercel.app`
6. Click "Deploy"

### Step 3: Set Up Database
After first deploy:
```bash
# Run migrations on your production database
npx prisma migrate deploy

# Seed data
npx prisma db seed
```

---

## Option 2: Self-Hosted (Docker)

### Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/vivit_crm
      - NEXTAUTH_SECRET=your-secret
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=vivit_crm
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
volumes:
  postgres_data:
```

---

## Option 3: Railway / Render

### Railway
1. Connect your GitHub repo
2. Add PostgreSQL plugin
3. Set environment variables
4. Deploy

### Render
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `npm install && npx prisma generate && npm run build`
4. Set start command: `npm start`
5. Add PostgreSQL database
6. Set env vars
7. Deploy

---

## Database Setup (All Platforms)

### Local PostgreSQL
```bash
# Install PostgreSQL
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql

# Create database
createdb vivit_crm

# Set env var
export DATABASE_URL="postgresql://localhost:5432/vivit_crm"
```

### Supabase (Free Cloud PostgreSQL)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy Connection String
5. Use as `DATABASE_URL`

### Neon (Free Cloud PostgreSQL)
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Use as `DATABASE_URL`

---

## Post-Deployment Checklist

- [ ] Database migrated successfully
- [ ] Seed data created
- [ ] Environment variables set
- [ ] NEXTAUTH_URL matches actual domain
- [ ] Logo displays correctly
- [ ] Login works with demo credentials
- [ ] All dashboard modules load
- [ ] Role-based access works
- [ ] Dark/light mode toggles
- [ ] Responsive on mobile

---

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
- Check DATABASE_URL format
- Ensure database is accessible from deployment server
- For Vercel: use connection pooling (PgBouncer)

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches domain
- Check cookies are not blocked

---

## Support

For deployment support, contact: support@vivit.group

Todo:

### Deployment

- **Backend**: Deploy the Spring Boot app as a Docker container on Render’s free tier.
- **Frontend**: Build a static Angular site and host on Netlify’s free tier with automatic SSL and CDN.
- **Database**: Use Supabase’s free-tier managed PostgreSQL to eliminate database management.
- **Keycloak**: Deploy as a Docker container on Render, using Supabase for persistence.

## Prepare Application for Production

- Update `src/main/resources/application.yml` for production;
    - Use environment variables for sensitive data (database credentials, Keycloak URL).
    - Set ddl-auto: validate and use Flyway for schema migrations.
- Add Flyway for schema management:
    - Add flyway do pom.xml.
    - Create migration scripts in `src/main/resources/db/migration`.
- Angular config:
    - Update src/environments/environment.prod.ts:
```
  export const environment = {
      production: true,
      apiUrl: 'https://<your-backend-subdomain>.onrender.com/api',
      wsUrl: 'wss://<your-backend-subdomain>.onrender.com/ws',
      keycloak: {
      url: 'https://<your-keycloak-subdomain>.onrender.com',
      realm: 'whatsapp-clone',
      clientId: 'whatsapp-clone-app'
    }
  };     
```
and run ```ng build --prod```



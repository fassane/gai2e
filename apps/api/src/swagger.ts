import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

// Documentation de l'API : UI sur /api/, spécification JSON sur /api/docs-json.
export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('GAI2E Conseils')
    .setDescription(
      [
        'API de GAI2E Conseils : espace étudiant, back-office des conseillers et formulaires de la landing page.',
        '',
        '- Authentification : jeton **Bearer** (bouton *Authorize*), conservé entre deux rechargements.',
        '- Erreurs de validation : réponse **400** « Payload invalide » avec le détail des champs (`issues`).',
        '- Dates en UTC (ISO 8601), montants en entiers (unités mineures) avec leur devise.',
        '- Spécification OpenAPI au format JSON : [`/api/docs-json`](/api/docs-json).',
      ].join('\n'),
    )
    .setVersion(process.env['APP_VERSION'] ?? 'dev')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey.replace('Controller', '')}_${methodKey}`,
  });

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      displayOperationId: true,
      displayRequestDuration: true,
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
      tryItOutEnabled: true,
    },
    customSiteTitle: 'GAI2E Conseils · API',
    // Servis par main.ts (useStaticAssets) depuis src/assets/docs
    customCssUrl: '/api/docs-assets/swagger.css',
    customfavIcon: '/api/docs-assets/favicon.svg',
    // Sous /api/ (et non /api-json, le défaut) : Nginx ne transmet à l'api que les URL en /api/
    jsonDocumentUrl: 'api/docs-json',
    yamlDocumentUrl: 'api/docs-yaml',
  };
  // cleanupOpenApiDoc convertit les schémas des DTOs zod (createZodDto) en OpenAPI.
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(document), customOptions);
}

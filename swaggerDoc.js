const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: '3.0.1',
        info: {
            title: 'GMD api',
            version: '1.0.0',
            description: 'GMD api'
        },
        basePath: '/api',
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-API-KEY'
                }
            }
        },
        security: [
            {},
            {bearerAuth: []}
        ]
    },
    apis: ['./docs/*.yaml', './api/controllers/*.js']
};

const specs = swaggerJsDoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
import api from '@ioa/api';
import { components } from 'ioa';

const { middleware } = components['@common'];

api.use(middleware.cors);

// api.get('/rest/other', 'rest.other');

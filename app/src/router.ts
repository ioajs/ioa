import api from '@ioa/api';
import { components } from 'ioa';

const { cors } = components['@common'].middleware;

api.use(cors);

// api.get('/rest/other', 'rest.other');


import { SetMetadata } from '@nestjs/common';

/**
 * Allow everyone to access a route
 * @constructor
 */
export const Public = () => SetMetadata('public', true);

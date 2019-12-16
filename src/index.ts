import * as communication from './communication';
import * as tempManager from './manager/temp_manager';
import { logger } from './logger';

try {
  tempManager.clean();
  communication.execute();
} catch (err) {
  // Unhandled catch
  logger.error(err);
}

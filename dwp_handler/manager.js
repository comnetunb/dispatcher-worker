// General Requirements
const logger = require('../logger');
const dispatcherProtocol = require('dispatcher-protocol');

// Protocol Related
const { factory } = dispatcherProtocol;

// DWP Handler Related
const getReportHandler = require('./handler/get_report_handler');
const performTaskHandler = require('./handler/perform_task_handler');
const terminateTaskHandler = require('./handler/terminate_task_handler');
const performCommandHandler = require('./handler/perform_command_handler');
const languageManager = require('../manager/language_manager');

module.exports.treat = (packet, socket) => {
  let pdu;

  try {
    pdu = JSON.parse(packet.toString());
    factory.validate(pdu);
  } catch (e) {
    return logger.fatal(e);
  }

  return chooseHandler(pdu, socket);
};

function chooseHandler(pdu, socket) {
  switch (pdu.header.id) {
    case factory.Id.GET_REPORT:
      getReportHandler.execute(pdu, socket);
      break;

    case factory.Id.PERFORM_TASK:
      performTaskHandler.execute(pdu, socket);
      break;

    case factory.Id.TERMINATE_TASK:
      terminateTaskHandler.execute(pdu, socket);
      break;

    case factory.Id.PERFORM_COMMAND:
      performCommandHandler.execute(pdu, socket);
      break;

    case factory.Id.GET_LANGUAGE_SUPPORT:
      languageManager.getLanguageSupport(pdu, socket);
      break;

    case factory.Id.LANGUAGE_COMMAND:
      languageManager.testLanguages(pdu);
      break;

    default:
  }
}

const Filter = require("bad-words");
const { renderMessageSocket } = require("../utils/createMessageSocket");
const { getUserList } = require("../utils/createUsers");
const { createMessageMG } = require("../controllers/message.controller");
const { SOCKET_COMMIT, TEXT_BAD } = require("../common/common.constants");

module.exports = (socket_io) => {
  socket_io.on(SOCKET_COMMIT.CONNECT, (socket) => {
    /**reciver join room */
    socket.on(SOCKET_COMMIT.JOIN_ROOM, ({ fullName, room, account, uid }) => {
      if (fullName === null && account === null && uid === null) return;
      socket.join(room);
      /** notify */
      socket.emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `Hello ${fullName}`);
      /** send message to new client after join */
      socket.broadcast
        .to(room)
        .emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `${fullName} Online`);
      // socket.emit(SOCKET_COMMIT.SEND_LIST_USERS, getUserList({ uid }));
      /** chat */
      socket.on(SOCKET_COMMIT.SEND_MESSAGE, (message, callBackAcknow) => {
        const filter = new Filter();
        filter.addWords(...TEXT_BAD);
        // const sendSuccess = 200;
        if (filter.isProfane(message)) {
          // let returnText = filter.clean(message); show text ****
          return callBackAcknow(SOCKET_COMMIT.MESSAGE_NOT_AVALID);
        }
        // save database
        createMessageMG({ message, account, fullName, uid });
        socket_io
          .to(room)
          .emit(
            SOCKET_COMMIT.SEND_LIST_MESSAGE,
            renderMessageSocket({ message, account, fullName, uid })
          );
        callBackAcknow();
      });
      /** location */
      socket.on(SOCKET_COMMIT.SEND_LOCATION, (location) => {
        if (location) {
          const linkLocation = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
          createMessageMG({ message: linkLocation, account, fullName, uid });
          socket_io.to(room).emit(
            SOCKET_COMMIT.SEND_LIST_MESSAGE,
            renderMessageSocket({
              message: linkLocation,
              account,
              fullName,
              uid,
            })
          );
        }
      });

      /**disconnect socket io */
      socket.on(SOCKET_COMMIT.DISCONNECTED, () => {
        // removeUserList(socket.id);
        `${fullName} sign out`;
      });
    });
  });
};
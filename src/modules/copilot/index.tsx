import React, { useCallback, useEffect, useRef, useState } from 'react';
import TextArea from 'src/@vymo/ui/atoms/textArea';
// import { ReactComponent as LandingSvg } from 'src/assets/copilot/landing_image.svg';
import { ReactComponent as LoadingSvg } from 'src/assets/copilot/loading.svg';
import { ReactComponent as MenuSvg } from 'src/assets/copilot/menu.svg';
import { ReactComponent as SendSvg } from 'src/assets/copilot/send.svg';
import { ReactComponent as SuggestSvg } from 'src/assets/copilot/suggest.svg';
import { ReactComponent as TypingSvg } from 'src/assets/copilot/typing.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import {
  COPILOT_FOLLOW_UP_QUESTIONS,
  COPILOT_RETRIES,
} from 'src/modules/constants';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { ReactComponent as CopilotIconSvg } from '../../assets/copilot/copilot_icon.svg';
import { ReactComponent as CopilotSvg } from '../../assets/copilot/copilot_user.svg';
import { ReactComponent as CrossSvg } from '../../assets/copilot/cross.svg';
import { ReactComponent as UnSendSvg } from '../../assets/copilot/disable_send.svg';
import Popup from './messageType/popup';
import RenderLead from './messageType/render.lead';
import RenderTable from './messageType/render.table';
import RenderText from './messageType/render.text';
import Toast from './messageType/toast';
import {
  getClientId,
  getIsCopilotOpen,
  getIsLoading,
  getIsTyping,
  getMessages,
  getNewSession,
  getReplies,
  getRetry,
  getSampleQuestions,
  getShowMenu,
  getShowToast,
  getSocket,
  getThreadId,
  getToastText,
} from './selector';
import {
  addMessage,
  setIsCopilotOpen,
  setIsTyping,
  setNewSession,
  setRetryCount,
  setShowMenu,
  setShowToast,
  setSocket,
  setToastText,
} from './slice';
import { clearHistory, connectWebSocket, getHistory } from './thunk';
import { HistoryPayload, Message, MESSAGE_TYPE } from './types';
import styles from './index.module.scss';

function Copilot() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(getIsLoading);
  const isTyping = useAppSelector(getIsTyping);
  const threadId = useAppSelector(getThreadId);
  const clientId = useAppSelector(getClientId);
  const showToast = useAppSelector(getShowToast);
  const toastText = useAppSelector(getToastText);
  const showMenu = useAppSelector(getShowMenu);
  const messages = useAppSelector(getMessages);
  const newSession = useAppSelector(getNewSession);
  const replies = useAppSelector(getReplies);
  const sampleQuestions = useAppSelector(getSampleQuestions);
  const socket = useAppSelector(getSocket);
  const isCopilotOpen = useAppSelector(getIsCopilotOpen);
  const retry = useAppSelector(getRetry);

  const [newMessage, setNewMessage] = useState('');

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const horizontalContainerRef = useRef<HTMLDivElement | null>(null);

  const [isScrollingUp, setIsScrollingUp] = useState(false);

  const timeout = useRef<NodeJS.Timeout | undefined>();
  const handleScroll = useCallback(() => {
    setIsScrollingUp(true);

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      setIsScrollingUp(false);
    }, 1000);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const scrollReplies = useCallback(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollLeft = 0;
    }
  }, []);

  useEffect(() => {
    scrollReplies();
  }, [replies, scrollReplies]);

  const scrollInput = useCallback(() => {
    // @ts-ignore
    const textarea = textAreaRef.current.element;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    scrollInput();
  }, [newMessage, scrollInput]);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleReplyClick = useCallback(
    (reply: string) => {
      setNewMessage(reply);
    },
    [setNewMessage],
  );

  const clearChatHistory = () => {
    if (threadId && clientId) {
      const queryParams: HistoryPayload = {
        client_id: clientId,
        thread_id: threadId,
      };
      dispatch(clearHistory(queryParams));
    } else {
      dispatch(setToastText(locale(Keys.NO_HISTORY_FOUND)));
      dispatch(setShowToast(true));
    }
  };

  useEffect(() => {
    if (newSession && socket) {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      dispatch(connectWebSocket());
      dispatch(setNewSession(false));
      setNewMessage('');
    }
  }, [newSession, dispatch, socket]);

  useEffect(() => {
    if (socket === null && isCopilotOpen && retry < Number(COPILOT_RETRIES)) {
      dispatch(connectWebSocket());
      dispatch(setRetryCount(retry + 1));
    }
  }, [socket, dispatch, isCopilotOpen, retry]);

  const closeCopilot = () => {
    dispatch(setIsCopilotOpen(false));
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
      dispatch(setSocket(null));
    }
    const data = {
      code: 'close-activity',
      text: locale(Keys.CLOSE_COPILOT),
    };
    const messageData = JSON.stringify(data);
    // @ts-ignore
    if (window.Android) {
      // @ts-ignore
      window.Android.handleMessage(messageData);
    }
    // @ts-ignore
    if (window?.ReactNativeWebView?.postMessage) {
      // @ts-ignore
      window?.ReactNativeWebView?.postMessage(messageData, '*');
    }
  };

  useEffect(() => {
    if (threadId && clientId) {
      const queryParams: HistoryPayload = {
        client_id: clientId,
        thread_id: threadId,
      };
      dispatch(getHistory(queryParams));
    }
  }, [threadId, clientId, dispatch]);

  const handleSend = useCallback(() => {
    if (newMessage !== '') {
      const newMessageItem = {
        sender: 'USER',
        message_type: MESSAGE_TYPE.TEXT,
        text: newMessage,
      };

      const data = {
        question: newMessage,
      };
      dispatch(addMessage(newMessageItem));
      setNewMessage('');

      let timeoutId: NodeJS.Timeout | null = null;
      dispatch(setIsTyping(true));

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
      } else if (socket) {
        timeoutId = setTimeout(() => {
          dispatch(setIsTyping(false));
          dispatch(
            setToastText(locale(Keys.FAILED_TO_CONNECT_PLEASE_TRY_AGAIN)),
          );
          dispatch(setShowToast(true));
        }, 10000);

        socket.addEventListener('open', () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          socket.send(JSON.stringify(data));
        });
      } else {
        dispatch(setIsTyping(false));
        dispatch(setToastText(locale(Keys.DISCONNECTED_PLEASE_TRY_AGAIN)));
        dispatch(setShowToast(true));
      }
    }
  }, [newMessage, dispatch, socket]);

  function renderBubble(message: Message) {
    if (message.message_type === MESSAGE_TYPE.LEADS) {
      return <RenderLead message={message} />;
    }
    if (message.message_type === MESSAGE_TYPE.TABLE) {
      return <RenderTable message={message} />;
    }
    return <RenderText message={message} />;
  }

  function sampleQuestionsBubble() {
    return (
      <div data-test-id="sample-questions">
        {/* <span className={styles.sampleText}>
          Instant, personalised support at your fingertips
        </span>
        <LandingSvg className={styles.initialImage} /> */}
        {sampleQuestions.length > 0 && (
          <>
            <span className={styles.sampleText}>
              {locale(Keys.FIRST_CONVERSATION_PROMPTS)}
            </span>
            <div className={styles.sampleBox}>
              <div className={styles.sampleContainer}>
                {sampleQuestions.map((question) => (
                  <button
                    type="button"
                    onClick={() => handleReplyClick(question)}
                    className={styles.sample}
                  >
                    <span className={styles.userText}>{question}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.copilot}>
      <Popup
        show={showMenu}
        onClose={() => dispatch(setShowMenu(false))}
        onDlete={clearChatHistory}
      />
      <div
        className={`${styles.header} ${
          isScrollingUp ? styles.withBoxShadow : ''
        }`}
        data-test-id="copilot-module-header"
      >
        <button
          type="button"
          className={styles.backIcon}
          onClick={() => closeCopilot()}
        >
          <span className={styles.visually_hidden}>
            {locale(Keys.CLOSE_COPILOT)}
          </span>
          <CrossSvg />
        </button>
        <div className={styles.icon}>
          <CopilotIconSvg />
          <span className={styles.title}>{locale(Keys.VYMO_COPILOT)}</span>
        </div>
        <button
          type="button"
          className={styles.backIcon}
          onClick={() => dispatch(setShowMenu(true))}
          data-test-id="menu-button"
        >
          <span className={styles.visually_hidden}>{locale(Keys.MENU)}</span>
          <MenuSvg />
        </button>
      </div>
      <div className={styles.chatContainer} ref={chatContainerRef}>
        {isLoading && (
          <div className={styles.loading}>
            <LoadingSvg />
          </div>
        )}

        {!isLoading &&
          (messages.length > 0
            ? messages.map((message) => renderBubble(message))
            : sampleQuestionsBubble())}
        {isTyping ? (
          <div data-test-id="typing">
            <CopilotSvg className={styles.aiIcon} />
            <TypingSvg />
          </div>
        ) : (
          replies.length > 0 && (
            <div className={styles.replyContainer} ref={horizontalContainerRef}>
              {replies.length <= Number(COPILOT_FOLLOW_UP_QUESTIONS) ? (
                <span className={styles.related_questions}>
                  {locale(Keys.RELATED_QUESTIONS)}
                </span>
              ) : null}
              {replies.map((reply) => (
                <button
                  type="button"
                  onClick={() => handleReplyClick(reply)}
                  className={styles.reply}
                >
                  <span>{reply}</span>
                </button>
              ))}
            </div>
          )
        )}
      </div>

      <div
        className={`${styles.footer} ${
          isScrollingUp ? styles.withFooterShadow : ''
        }`}
        data-test-id="copilot-module-footer"
      >
        <SuggestSvg />
        <div className={styles.inputContainer}>
          <TextArea
            ref={textAreaRef}
            placeholder={locale(Keys.ASK_ME_ANYTHING)}
            onChange={setNewMessage}
            value={newMessage}
            classNames={styles.input}
            minLines={1}
            data-test-id="input-element"
            resize={false}
          />
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={isTyping}
          className={styles.sendButton}
          data-testid="send-icon"
          data-test-id="send-icon"
        >
          {isTyping || newMessage === '' ? (
            <UnSendSvg className={styles.sendIcon} />
          ) : (
            <SendSvg className={styles.sendIcon} />
          )}
        </button>
      </div>
      <Toast
        text={toastText}
        onClose={() => dispatch(setShowToast(false))}
        isVisible={showToast}
      />
    </div>
  );
}

export default Copilot;

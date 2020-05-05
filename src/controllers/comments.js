// Отрисовка элементов
import {render} from "../utils/render.js";

// Секция, отвечающая за комментарии в детальной информации о фильме
import CommentsComponent from "../components/comments.js";
// Контроллер комментария
import CommentController from "../controllers/comment.js";


export default class CommentsController {
  constructor(container, commentsModel, onDataChange) {
    // FilmDetailsComponent
    this._container = container;
    this._commentsModel = commentsModel;
    this._onDataChange = onDataChange;

    this._commentsComponent = null;

    this._onCommentDataChange = this._onCommentDataChange.bind(this);

  }

  // Отрисовка секции комментариев
  render() {
    this._commentsComponent = new CommentsComponent(this._container.film);
    // Используется, чтобы отловить нажатие Ctrl+Enter на поле комментария
    this._commentsComponent.setCtrlEnterKeyDownHandler((evt) => {
      if ((evt.key === `Enter`) && (evt.ctrlKey || evt.metaKey)) {
        this._onCommentDataChange(null, this._container.getData());
      }
    });

    render(this._container.getCommentsEntryPointElement(), this._commentsComponent);
    this._renderComments();
  }

  // Отрисовка отдельных комментариев
  _renderComments() {
    const film = this._container.film;
    this._commentsModel.getComments(film).forEach((comment) => {
      new CommentController(this._commentsComponent, this._onCommentDataChange).render(comment);
    });
  }

  _onCommentDataChange(oldData, newData) {
    const film = this._container.film;
    if (newData === null) {
      if (!this._commentsModel.removeComment(oldData.id)) {
        return;
      }
    } else if (oldData === null) {
      this._commentsModel.addComment(Object.assign(newData, {filmId: film.id}));
    } else {
      return;
    }

    this._onDataChange(film, Object.assign({}, film, {commentsCount: this._commentsModel.getComments(film).length}));
  }
}

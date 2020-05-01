// Отрисовка элементов
import {render} from "../utils/render.js";

// Комментарий
import CommentComponent from "../components/comment.js";

export default class CommentController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
  }

  render(comment) {
    const commentComponent = new CommentComponent(comment);
    commentComponent.setDeleteButtonClickHandler(() => this._onDataChange(comment, null));

    const containerElement = this._container.getCommentsListElement();
    render(containerElement, commentComponent);
  }
}

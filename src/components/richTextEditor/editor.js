import React from "react";
import { Editor } from "slate-react";
import { Value } from "slate";
import { isKeyHotkey } from "is-hotkey";
import styled from "styled-components";
import Icon from "./icons";

import "./editor.css";

//button
const Button = styled.span`
  cursor: pointer;
  color: ${props =>
    props.reversed
      ? props.active
        ? "white"
        : "#aaa"
      : props.active
      ? "black"
      : "#ccc"};
`;
//toolbar
const Toolbar = styled.div`
  display: inline-block;
  position: relative;
  padding: 1px 18px 17px;
  margin: 0 -20px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
`;

//default node
const DEFAULT_NODE = "paragraph";

// hotkey matchers
const isBoldHotkey = isKeyHotkey("mod+b");
const isItalicHotkey = isKeyHotkey("mod+i");
const isUnderlinedHotkey = isKeyHotkey("mod+u");
const isCodeHotkey = isKeyHotkey("mod+`");

//initial value
const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: "Example text"
              }
            ]
          }
        ]
      }
    ]
  }
});

class TextEditor extends React.Component {
  state = {
    value: Value.fromJSON(initialValue)
  };

  isNestedList = false;

  // check if current selection has a type of mark on it
  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type == type);
  };

  //check if currently selected blocks are of some type

  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(node => node.type == type);
  };

  // store a reference to the editor

  ref = editor => {
    this.editor = editor;
  };

  render() {
    return (
      <div>
        <Toolbar>
          {this.renderMarkButton("bold", "bold")}
          {this.renderMarkButton("italic", "italic")}
          {this.renderMarkButton("underlined", "underline")}
          {this.renderMarkButton("code", "code")}
          {this.renderBlockButton("heading-one", "heading")}
          {this.renderBlockButton("heading-two", "heading")}
          {this.renderBlockButton("block-quote", "quote-left")}
          {this.renderBlockButton("numbered-list", "list-ol")}
          {this.renderBlockButton("bulleted-list", "list-ul")}
        </Toolbar>
        <Editor
          spellCheck
          placeholder="Enter some rich text..."
          ref={this.ref}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
      </div>
    );
  }

  // get the markdown shortcuts
  getType = chars => {
    switch (chars) {
      case "*":
      case "-":
      case "+":
        return "list-item";
      case ">":
        return "block-quote";
      case "#":
        return "heading-one";
      case "##":
        return "heading-two";
      case "###":
        return "heading-three";
      case "####":
        return "heading-four";
      case "#####":
        return "heading-five";
      case "######":
        return "heading-six";
      default:
        return null;
    }
  };

  // render mark-togglinf button

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon icon={icon} />
      </Button>
    );
  };

  //render block-toggling button

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);

    if (["numbered-list", "bulleted-list"].includes(type)) {
      const {
        value: { document, blocks }
      } = this.state;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.hasBlock("list-item") && parent && parent.type === type;
      }
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon icon={icon} />
      </Button>
    );
  };

  // render a slate node

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "heading-three":
        return <h3 {...attributes}>{children}</h3>;
      case "heading-four":
        return <h4 {...attributes}>{children}</h4>;
      case "heading-five":
        return <h5 {...attributes}>{children}</h5>;
      case "heading-six":
        return <h6 {...attributes}>{children}</h6>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      default:
        return next();
    }
  };

  /// redner a slate mark

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "code":
        return <code {...attributes}>{children}</code>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      case "underlined":
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  };

  // save the value on change

  onChange = ({ value }) => {
    this.setState({ value });
  };

  // handle keydown for marking

  onKeyDown = (event, editor, next) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = "bold";
    } else if (isItalicHotkey(event)) {
      mark = "italic";
    } else if (isUnderlinedHotkey(event)) {
      mark = "underlined";
    } else if (isCodeHotkey(event)) {
      mark = "code";
    } else if (event.key == " ") {
      return this.onSpace(event, editor, next);
    } else if (event.key === "Backspace") {
      return this.onBackspace(event, editor, next);
    } else if (event.key === "Enter") {
      return this.onEnter(event, editor, next);
    } else if (event.key === "Tab") {
      return this.onTabKey(event, editor, next);
    } else {
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  };

  // handle tab key
  onTabKey = (event, editor, next) => {
    event.preventDefault();

    const { value } = editor;
    const { selection } = value;
    const { startBlock } = value;

    if (selection.isExpanded) {
      var start = selection.start;

      editor.moveTo(start.key, start.offset).insertText("  ");
      return next();
    }

    if (startBlock.type == "list-item" && startBlock) {
      this.isNestedList = true;
      editor.wrapBlock("bulleted-list");
      return next();
    }

    editor.insertText("  ");
  };

  // handle spacebar
  onSpace = (event, editor, next) => {
    const { value } = editor;
    const { selection } = value;
    if (selection.isExpanded) return next();

    const { startBlock } = value;
    const { start } = selection;
    const chars = startBlock.text.slice(0, start.offset).replace(/\s*/g, "");
    const type = this.getType(chars);
    if (!type) return next();
    if (type == "list-item" && startBlock.type == "list-item") return next();
    event.preventDefault();

    editor.setBlocks(type);

    if (type == "list-item") {
      editor.wrapBlock("bulleted-list");
    }

    editor.moveFocusToStartOfNode(startBlock).delete();
  };

  // handle backspace
  onBackspace = (event, editor, next) => {
    const { value } = editor;
    const { selection } = value;
    const { document } = value;
    // handle deletion if higlighted (normal behaviour)
    if (selection.isExpanded) return next();
    // handle if cursor is in-between text, resort to normal behaviour
    if (selection.start.offset != 0) return next();

    const { startBlock } = value;
    // nothing special if paragraph
    if (startBlock.type == "paragraph") return next();

    event.preventDefault();
    editor.setBlocks("paragraph");

    // handle escaping indent due to failed nested lists (if required)
    // if (
    //   value.blocks.some(block => {
    //     document.getClosest(
    //       block.key,
    //       parent => parent.type === "numbered-list"
    //     );
    //   })
    // ) {
    //   document.unwrapBlock("numbered-list");
    // } else if (
    //   value.blocks.some(block => {
    //     document.getClosest(
    //       block.key,
    //       parent => parent.type === "bulleted-list"
    //     );
    //   })
    // ) {
    //   document.unwrapBlock("bulleted-list");
    // }

    // handle nested lists
    if (startBlock.type == "list-item") {
      let par, gp;
      // get the current parent and grandparent
      const isNested = value.blocks.some(block => {
        // parent
        par = document.getClosest(block.key, () => true);
        // grandparent
        gp = document.getClosest(par.key, () => true);

        if (
          par &&
          (par.type === "bulleted-list" || par.type === "numbered-list") &&
          gp &&
          (gp.type === "bulleted-list" || gp.type === "numbered-list")
        ) {
          // true => nested list exist
          return true;
        } else {
          return false;
        }
      });

      // if not nested
      if (isNested === false) {
        // unwrap bulleted list OR numbered based on parent
        console.log("yo");
        par.type === "bulleted-list"
          ? editor.unwrapBlock("bulleted-list")
          : editor.unwrapBlock("numbered-list");
        // exit function
        return next();
      }
      // handle nested list
      if (
        par.type === "bulleted-list" &&
        (gp.type === "numbered-list" || gp.type === "bulleted-list")
      ) {
        // if parent is ul, unwrap ul
        editor.unwrapBlock("bulleted-list");
        editor.setBlocks("list-item");
      } else if (
        par.type === "numbered-list" &&
        (gp.type === "numbered-list" || gp.type === "bulleted-list")
      ) {
        editor.unwrapBlock("numbered-list");
        editor.setBlocks("list-item");
      }
    }
  };

  // handle enter
  onEnter = (event, editor, next) => {
    const { value } = editor;
    const { selection } = value;
    const { start, end, isExpanded } = selection;
    if (isExpanded) return next();

    const { startBlock } = value;
    if (start.offset == 0 && startBlock.text.length == 0)
      return this.onBackspace(event, editor, next);
    if (end.offset != startBlock.text.length) return next();

    if (
      startBlock.type != "heading-one" &&
      startBlock.type != "heading-two" &&
      startBlock.type != "heading-three" &&
      startBlock.type != "heading-four" &&
      startBlock.type != "heading-five" &&
      startBlock.type != "heading-six" &&
      startBlock.type != "block-quote"
    ) {
      return next();
    }

    event.preventDefault();

    editor.splitBlock().setBlocks("paragraph");
  };

  // toggle mark on click

  onClickMark = (event, type) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  };

  // toggle block on click

  onClickBlock = (event, type) => {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    // Handle everything but list buttons.
    if (type != "bulleted-list" && type != "numbered-list") {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("list-item");

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock("list-item");
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type == type);
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else if (isList) {
        editor
          .unwrapBlock(
            type == "bulleted-list" ? "numbered-list" : "bulleted-list"
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks("list-item").wrapBlock(type);
      }
    }
  };
}

export default TextEditor;

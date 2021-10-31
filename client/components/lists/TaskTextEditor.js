import dynamic from "next/dynamic"
import {
  ContentState,
  convertToRaw,
  EditorState,
  getDefaultKeyBinding,
} from "draft-js"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
import { useCallback, useEffect, useState, useRef } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import styles from "./TaskTextEditor.module.scss"

import { Editor } from "react-draft-wysiwyg"

//<TaskTextArea
//text={text}
//setText={setText}
//handleClosingEditMode={handleClosingEditMode}
///>
//

const TaskTextEditor = ({ html, onEditingFinished }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  useEffect(() => {
    const contentBlock = htmlToDraft(html)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      )
      setEditorState(EditorState.createWithContent(contentState))
    }
  }, [])

  const handleClosingEditMode = useCallback(() => {
    const html = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    ).trim()
    console.log(html)
    onEditingFinished(html)
  }, [editorState, onEditingFinished])

  const closeIfReturn = useCallback(
    (event) => {
      if (event.keyCode == 13 && !event.shiftKey) {
        handleClosingEditMode()
      }

      return getDefaultKeyBinding(event)
    },
    [handleClosingEditMode]
  )
  console.log(styles.taskTextEditor)
  return (
    <DetectClickOutside onOutsideClick={handleClosingEditMode}>
      <div className="editor">
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          editorClassName={styles.taskTextEditor}
          toolbar={{
            options: [
              "inline",
              "blockType",
              "fontSize",
              "list",
              "textAlign",
              "colorPicker",
              "link",
              "embedded",
              "emoji",
              "image",
              "remove",
              "history",
            ],
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: false },
            fontFamily: false,
            //image: {
            //uploadCallback: uploadImageCallBack,
            //alt: { present: true, mandatory: true },
            //},
          }}
          keyBindingFn={closeIfReturn}
        />
      </div>
    </DetectClickOutside>
  )
}

const DetectClickOutside = (props) => {
  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef, props.onOutsideClick)
  return <div ref={wrapperRef}>{props.children}</div>
}

const useOutsideAlerter = (ref, callback) => {
  // https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(ref.current)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, callback])
}

export default TaskTextEditor

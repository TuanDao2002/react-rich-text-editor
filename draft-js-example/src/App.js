import React, { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import DOMPurify from "dompurify";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./App.css";
import draftToHtml from "draftjs-to-html";

const App = () => {
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	);
	const [convertedContent, setConvertedContent] = useState(null);
	const handleEditorChange = (state) => {
		setEditorState(state);
		convertContentToHTML();
	};
	const convertContentToHTML = () => {
		let currentContentAsHTML = draftToHtml(
			convertToRaw(editorState.getCurrentContent())
		);
		setConvertedContent(currentContentAsHTML);
	};
	const createMarkup = (html) => {
		console.log(html);
		return {
			__html: DOMPurify.sanitize(html),
		};
	};
	return (
		<div className="App">
			<header className="App-header">Rich Text Editor Example</header>
			<Editor
				editorState={editorState}
				onEditorStateChange={handleEditorChange}
				wrapperClassName="wrapper-class"
				editorClassName="editor-class"
				toolbarClassName="toolbar-class"
			/>
			<textarea
				disabled
				value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
			/>
			<div
				className="preview"
				dangerouslySetInnerHTML={createMarkup(convertedContent)}
			></div>
		</div>
	);
};
export default App;

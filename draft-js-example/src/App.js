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

	// const uploadImageCallBack = (file) => {
	// 	return new Promise((resolve, reject) => {
	// 		const data = new FormData();
	// 		data.append("image", file);
	// 		axios
	// 			.post("https://bits-gt8m.onrender.com/api/image/upload-image", data, {
	// 				headers: {
	// 					"Content-Type": "multipart/form-data",
	// 				},
	// 			})
	// 			.then((res) => {
	// 				console.log(res.image.src);
	// 				resolve({ data: { url: res.image.src } });
	// 			})
	// 			.catch((err) => {
	// 				reject(err);
	// 			});
	// 	});
	// 	// handlePastedFiles(files)
	// };

	function uploadImageCallBack(file) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("POST", "https://bits-gt8m.onrender.com/api/image/upload-image");
			const data = new FormData();
			data.append("image", file);
			xhr.send(data);
			xhr.addEventListener("load", () => {
				var data = JSON.parse(xhr.responseText);

				// Magic Happens Here
				console.log(data);
				var response = { data: { link: data.image.src } };

				resolve(response);
				// console.log(response);
			});
			xhr.addEventListener("error", () => {
				const error = JSON.parse(xhr.responseText);
				reject(error);
			});
		});
	}

	// const handlePastedFiles = (files) => {
	// 	const formData = new FormData();
	// 	formData.append("file", files[0]);
	// 	fetch("http://localhost:8080/api/image/upload-image", {
	// 		method: "POST",
	// 		body: formData,
	// 	})
	// 		.then((res) => res.json())
	// 		.then((data) => {
	// 			if (data.image.src) {
	// 				setEditorState(insertImage(data.image.src)); //created below
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };

	// const insertImage = (url) => {
	// 	const contentState = editorState.getCurrentContent();
	// 	const contentStateWithEntity = contentState.createEntity(
	// 		"IMAGE",
	// 		"IMMUTABLE",
	// 		{ src: url }
	// 	);
	// 	const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
	// 	console.log("key: " + entityKey);
	// 	const newEditorState = EditorState.set(editorState, {
	// 		currentContent: contentStateWithEntity,
	// 	});
	// 	return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, "");
	// };

	return (
		<div className="App">
			<header className="App-header">Rich Text Editor Example</header>
			<Editor
				editorState={editorState}
				onEditorStateChange={handleEditorChange}
				wrapperClassName="wrapper-class"
				editorClassName="editor-class"
				toolbarClassName="toolbar-class"
				toolbar={{
					inline: { inDropdown: true },
					list: { inDropdown: true },
					textAlign: { inDropdown: true },
					link: { inDropdown: true },
					history: { inDropdown: true },
					image: {
						uploadEnabled: true,
						uploadCallback: uploadImageCallBack,
						previewImage: true,
						inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
						alt: { present: false, mandatory: false },
						defaultSize: {
							height: "auto",
							width: "auto",
						},
					},
				}}
				// handlePastedFiles={handlePastedFiles}
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

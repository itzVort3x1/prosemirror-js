import logo from './logo.svg';
import './App.css';
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"
import React, { useEffect } from 'react';
import DinoPage from './components/Dino';
// import ScratchSchema from './components/scratchSchema';

function App(){
  let state;
  let view;
  useEffect(() => {
    let existingData = localStorage.getItem("editor");
    console.log(existingData);
    const nodeSpec = {
      // Dinosaurs have one attribute, their type, which must be one of
      // the types defined above.
      // Brontosaurs are still the default dino.
      attrs: {type: {default: "test-data"}},
      inline: true,
      group: "inline",
      draggable: true,
    
      // These nodes are rendered as images with a `dino-type` attribute.
      // There are pictures for all dino types under /img/dino/.
      toDOM: node => [existingData.toString()],
      // When parsing, such an image, if its type matches one of the known
      // types, is converted to a dino node.
      // parseDOM: [{
      //   tag: "img[dino-type]",
      //   getAttrs: dom => {
      //     let type = dom.getAttribute("dino-type")
      //     return dinos.indexOf(type) > -1 ? {type} : false
      //   }
      // }]
  }
    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
      marks: schema.spec.marks
    })
    // let state = EditorState.create({schema: mySchema})
// var [editorState, setEditorState] = useProsemirror({doc, ...and a bunch of other props that you can glean from the PM examples})

    let state = EditorState.create({ 
      doc: DOMParser.fromSchema(mySchema).parse(document.querySelector("#content")),
      plugins: exampleSetup({schema: mySchema}),
      schema: mySchema
    })

    console.log(state.doc.from)
    
    view = new EditorView(document.querySelector("#editor"), {
      state: state,
      dispatchTransaction(transaction) {
        let newState;
        state = transaction.doc.content.toJSON();
        console.log(state);
        localStorage.setItem("editor", JSON.stringify(state));
        // console.log("Document size went from", transaction.before.content.size,"to", transaction.doc.content.size)
          // transaction.doc.content = JSON.parse(existingData)
        newState = view.state.apply(transaction)
        view.updateState(newState)
        // console.log(newState)
      },
    });
    
    
    // ProseMirror-menubar-wrapper
  }, []);

  return (
    <div className="App">
      <div id="editor"></div>
      <div id="content"></div>
      {/* <DinoPage /> */}
    </div>
  )
}

export default App;

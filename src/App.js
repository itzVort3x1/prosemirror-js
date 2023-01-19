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
import ScratchSchema from './components/scratchSchema';

function App(){
  // useEffect(() => {
  //   const mySchema = new Schema({
  //     nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  //     marks: schema.spec.marks
  //   })
    
  //   window.view = new EditorView(document.querySelector("#editor"), {
  //     state: EditorState.create({
  //       doc: DOMParser.fromSchema(mySchema).parse(document.querySelector("#content")),
  //       plugins: exampleSetup({schema: mySchema})
  //     })
  //   })
  // })

  return (
    <div className="App">
      {/* <div id="editor"></div>
      <div id="content"></div> */}
      <ScratchSchema />
    </div>
  )
}

export default App;

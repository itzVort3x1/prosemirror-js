import React from 'react';
import {Schema} from "prosemirror-model"
import {findWrapping} from "prosemirror-transform"
import { useEffect } from 'react';


const ScratchSchema = () => {

    const noteSchema = new Schema({
        nodes: {
            text: {
                group: "inline",
            },
            star: {
                inline: true,
                group: "inline",
                toDOM() { return ["star", "🟊"] },
                parseDOM: [{tag: "star"}]
              },
              paragraph: {
                group: "block",
                content: "inline*",
                toDOM() { return ["p", 0] },
                parseDOM: [{tag: "p"}]
              },
              boring_paragraph: {
                group: "block",
                content: "text*",
                marks: "",
                toDOM() { return ["p", {class: "boring"}, 0] },
                parseDOM: [{tag: "p.boring", priority: 60}]
              },
              doc: {
                content: "block+"
              }
        }
    })

    function makeNoteGroup(state, dispatch) {
        // Get a range around the selected blocks
        let range = state.selection.$from.blockRange(state.selection.$to)
        // See if it is possible to wrap that range in a note group
        let wrapping = findWrapping(range, noteSchema.nodes.notegroup)
        // If not, the command doesn't apply
        if (!wrapping) return false
        // Otherwise, dispatch a transaction, using the `wrap` method to
        // create the step that does the actual wrapping.
        if (dispatch) dispatch(state.tr.wrap(range, wrapping).scrollIntoView())
        return true
    }
    useEffect(() => {
        const mySchema = new Schema({
            nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
            marks: schema.spec.marks
        })
            
            window.view = new EditorView(document.querySelector("#editor"), {
            state: EditorState.create({
                doc: DOMParser.fromSchema(noteSchema).parse(document.querySelector("#content")),
                plugins: exampleSetup({schema: noteSchema})
            })
        })
    })

    return (
        <div className="App">
            <div id="editor"></div>
            <div id="content"></div>
        </div>
    )
}
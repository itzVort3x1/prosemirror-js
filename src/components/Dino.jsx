import React from 'react';
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup, buildMenuItems} from "prosemirror-example-setup"
import {MenuItem} from "prosemirror-menu"
import { useEffect } from 'react';

const DinoPage = () => {
    const dinos = ["brontosaurus", "stegosaurus", "triceratops", "tyrannosaurus", "pterodactyl"];
    const dinoNodeSpec = {
        // Dinosaurs have one attribute, their type, which must be one of
        // the types defined above.
        // Brontosaurs are still the default dino.
        attrs: {type: {default: "stegosaurus"}},
        inline: true,
        group: "inline",
        draggable: true,
      
        // These nodes are rendered as images with a `dino-type` attribute.
        // There are pictures for all dino types under /img/dino/.
        toDOM: node => ["img", {"dino-type": node.attrs.type,
                                src: "C:/Users/suman/Documents/rich-text-js/src/img/" + node.attrs.type + ".png",
                                title: node.attrs.type,
                                class: "dinosaur"}],
        // When parsing, such an image, if its type matches one of the known
        // types, is converted to a dino node.
        parseDOM: [{
          tag: "img[dino-type]",
          getAttrs: dom => {
            let type = dom.getAttribute("dino-type")
            return dinos.indexOf(type) > -1 ? {type} : false
          }
        }]
    }
    useEffect(() => {
    const dinoSchema = new Schema({
        nodes: schema.spec.nodes.addBefore("image", "dino", dinoNodeSpec),
        marks: schema.spec.marks
    })
    let content = document.querySelector("#content")
    let startDoc = DOMParser.fromSchema(dinoSchema).parse(content)
    let dinoType = dinoSchema.nodes.dino

    function insertDino(type) {
    return function(state, dispatch) {
        let {$from} = state.selection, index = $from.index()
        if (!$from.parent.canReplaceWith(index, index, dinoType))
        return false
        if (dispatch)
        dispatch(state.tr.replaceSelectionWith(dinoType.create({type})))
        return true
    }
    }
    let menu = buildMenuItems(dinoSchema)
    // Add a dino-inserting item for each type of dino
    dinos.forEach(name => menu.insertMenu.content.push(new MenuItem({
        title: "Insert " + name,
        label: name.charAt(0).toUpperCase() + name.slice(1),
        enable(state) { return insertDino(name)(state) },
        run: insertDino(name)
    })))
        window.view = new EditorView(document.querySelector("#editor"), {
            state: EditorState.create({
              doc: startDoc,
              // Pass exampleSetup our schema and the menu we created
              plugins: exampleSetup({schema: dinoSchema, menuContent: menu.fullMenu})
            })
          })
    }, []);
    
    return (
        <div className="App">
            <div id="editor"></div>
            <div id="content"></div>
        </div>
    );
}

export default DinoPage;
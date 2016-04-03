# DocumentDrivenArchimate
Document-Driven Archimate Specification Viewer and Modeler
Build with d3.js http://d3js.org/ and jquery https://jquery.com/

Based on the "The Open Group ArchiMate Model Exchange File Format" by the Open Group http://www.opengroup.org/subjectareas/enterprise/archimate/model-exchange-file-format

The Goal of this Project is to create a lightweight model editor for viewing and manipulating Archimate 2.0 models. The modelling happens document driven as the model is solely created based on the Archimate Model Exchange File Format and manipulations directly imply changes of the document.

The Viewer is written in pure Javascript and currently supports most of the Archimate Specification.  
However, for a fully functional modeler certain elements are missing.

## The architecture consists of the following:

1. a d3.js component for generating svg based on the model.
2. A general application script (documentmodengine.js)
3. The archimate_configuration.js, which specifies the behaviour of different ArchiMate elements for the viewer. It is also readable and interpretable by the general application.
4. Ultimately, the architecture requires ArchiMate models in the xml standard.

## How to install

1. Download the entire git repository.
2. Copy the files onto a webserver.
3. Run index.html in your webbrowser.
4. Drag an Archimate XML into the Drop-Into Window


## TODOS
1. make edit of attribtues by dialogue
2. realize: stakeholder, driver, assessment, requirement, constraint, Work Package, Deliverable, Plateau, Gap
3. make it possible to add egdes based on selection
4. handle relations by layers (node is on top or in other node)

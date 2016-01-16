# DocumentDrivenArchimate
Document-Driven Archimate Specification Viewer and Modeler
Build with d3.js http://d3js.org/ and jquery https://jquery.com/

Based on the "The Open Group ArchiMate Model Exchange File Format" by the Open Group http://www.opengroup.org/subjectareas/enterprise/archimate/model-exchange-file-format

The Goal of this Project is to create a lightweight model editor for viewing and manipulating Archimate 2.0 models. The modelling happens document driven as the model is solely created based on the Archimate Model Exchange File Format and manipulations directly imply changes of the document. 

The Viewer is written in pure Javascript and currently supports most of the Archimate Specification.  
However, for a fully functional modeler certain elements are missing.

The architecture consists of the following:

a d3.js component for generating svg based on the model. A general application script (app.js) and archimate_configuration.js that is readable and interpretable by the general application. Ultimately, the architecture requires ArchiMate models in the xml standard.

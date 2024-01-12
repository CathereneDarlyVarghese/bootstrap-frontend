import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  ltrCssLoader,
  RsLocalizationWrapper,
  rSuiteComponents,
  rtlCssLoader
} from '@react-form-builder/components-rsuite';
import {
  ActionDefinition,
  BiDi,
  ComponentLocalizer,
  createView,
  FormViewer,
  IFormViewer,
  Validators
} from '@react-form-builder/core';

const componentsMetadata = rSuiteComponents.map(definer => definer.build().model);
const view = createView(componentsMetadata)
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader);

const emptyForm = 
  {
    "version": "1",
    "form": {
      "key": "TVStatusForm",
      "type": "Screen",
      "props": {},
      "children": [
        {
          "key": "Question1",
          "type": "RsLabel",
          "props": {
            "text": {
              "value": "Is the TV powered on?"
            }
          }
        },
        {
          "key": "Answer1",
          "type": "RsDropdown",
          "props": {
            "data": {
              "value": [
                {
                  "value": "yes",
                  "label": "Yes"
                },
                {
                  "value": "no",
                  "label": "No"
                }
              ]
            }
          }
        },
        {
          "key": "Question2",
          "type": "RsLabel",
          "props": {
            "text": {
              "value": "Is there a display on the screen?"
            }
          }
        },
        {
          "key": "Answer2",
          "type": "RsDropdown",
          "props": {
            "data": {
              "value": [
                {
                  "value": "yes",
                  "label": "Yes"
                },
                {
                  "value": "no",
                  "label": "No"
                }
              ]
            }
          }
        },
        {
          "key": "Question3",
          "type": "RsLabel",
          "props": {
            "text": {
              "value": "Are there any sound issues?"
            }
          }
        },
        {
          "key": "Answer3",
          "type": "RsDropdown",
          "props": {
            "data": {
              "value": [
                {
                  "value": "yes",
                  "label": "Yes"
                },
                {
                  "value": "no",
                  "label": "No"
                }
              ]
            }
          }
        }
      ]
    },
    "localization": {},
    "languages": [
      {
        "code": "en",
        "dialect": "US",
        "name": "English",
        "description": "American English",
        "bidi": "ltr"
      }
    ],
    "defaultLanguage": "en-US"
  }
  


const formName = 'TV';

async function getFormFn(name?: string) {
  if (name === formName) return emptyForm;
  throw new Error(`Form '${name}' is not found.`);
}

interface ViewerProps {
  onSubmit: (formData: any) => void; // Adjust the type of formData based on your form structure
}

export const Viewer: React.FC<ViewerProps> = ({ onSubmit }) => {
  const ref = useRef<IFormViewer>(null);

  // Custom function for localizing component properties
  const localizeFn = useCallback<ComponentLocalizer>((componentStore, language) => {
    return componentStore.key === 'submit' && language.code === 'en'
      ? { 'children': `Submit` }
      : {};
  }, []);

  return (
    <FormViewer
      view={view}
      formName={formName}
      initialData={{}}
      localize={localizeFn}
      onFormDataChange={({ data, errors }) => {
        console.log('onFormDataChange', { data, errors });
      }}
      viewerRef={ref}
      actions={{
        logEventArgs: e => console.log(e),
        assertArgs: ActionDefinition.functionalAction((e, args) => {
          console.log(e, args);
        }),
        submitForm: () => {
          // Handle form submission
          const formData = ref.current?.getData;
          if (formData) {
            console.log('Form submitted:', formData);
            onSubmit(formData);
          }
        }
      }}
    />
  );
};

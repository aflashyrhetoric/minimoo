import { upperFirst } from 'lodash'
import { useState, useEffect } from 'react'
import {
  Form,
  TextInput,
  MultiSelect,
  RadioButton,
  RadioButtonGroup,
  Select,
  SelectItem,
  Button,
} from 'carbon-components-react'
import {
  PromptLevel,
  PromptType,
  PROMPT_LEVELS,
  PROMPT_TYPES,
  PROMPT_TYPE_SUBTYPE_MAP,
  ReceivedState,
  RECEIVED_STATES,
  TargetedSkill,
  TARGETED_SKILLS,
  PRONOUNS,
  Pronouns,
} from './types'

const styles = require('./report-writer.module.scss')

// event handler
// storage of values

interface TemplateFields {
  name?: string
  pronouns?: Pronouns
  received: ReceivedState
  participated_in: string
  targeted_skills: TargetedSkill[]
  accuracy_level: string // 25, 50, 75, 80, 90, 100 click to populate field

  prompt_level: PromptLevel
  prompt_types: PromptType[]
  prompt_subtypes: object
}

const UNDERSCORE = '___'

const buildCuesString = (types, subtypes: object) => {
  const withoutSubtypes = types.filter(
    type => !Object.keys(subtypes).includes(type)
  )

  const withSubtypes = Object.entries(subtypes).map(entry => {
    const [prompt_type, prompt_subtypes] = entry
    return `${prompt_type} cues (such as ${prompt_subtypes.join(', ')})`
  })

  return [...withoutSubtypes, ...withSubtypes].join(', ')
}

const template = ({
  name = 'Student',
  pronouns = PRONOUNS.they,
  received = ReceivedState.ENGAGED,
  participated_in = UNDERSCORE,
  targeted_skills = [UNDERSCORE],
  accuracy_level = UNDERSCORE, // TODO ? Pre-populate later based on previous sessions accuracy_level
  prompt_level = UNDERSCORE,
  prompt_types = [],
  prompt_subtypes = {},
}) => {
  const cuesString =
    Object.keys(prompt_subtypes).length === 0
      ? `${prompt_types.join(', ')} cues`
      : buildCuesString(prompt_types, prompt_subtypes)

  /* 

  if no subtype:

  and gestural, phonetic cues.
 
  if subtype:

  and gestural cues (such as x, y, z), phonetic cues
  
  */

  // Return the populated template data
  return `
${name === '' ? 'Student' : name} was received ${received}. ${upperFirst(
    pronouns.he
  )} participated in ${participated_in} to increase ${
    pronouns.his
  } ${targeted_skills.join(' & ')} abilities. ${upperFirst(
    pronouns.he
  )} responded with ${accuracy_level}% provided ${prompt_level} prompting and ${cuesString}.`
}

export default function ReportWriter() {
  const [formState, setFormState] = useState<TemplateFields>(
    {} as TemplateFields
  )
  const [output, setOutput] = useState('')

  useEffect(() => {
    setOutput(template(formState))
  }, [formState])

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h2>Input Form Data</h2>
        <Form style={{ width: '550px' }}>
          <TextInput
            id="name-input"
            type="text"
            size="sm"
            labelText="Student Name"
            value={formState && formState.name}
            placeholder="Student"
            onChange={e => setFormState({ ...formState, name: e.target.value })}
          />
          <div style={{ marginBottom: '10px' }} />
          <RadioButtonGroup
            labelText="Pronouns"
            name="pronoun-selector"
            defaultSelected={'they'}
            onChange={e =>
              setFormState({ ...formState, pronouns: PRONOUNS[e] })
            }
          >
            {Object.keys(PRONOUNS).map(p => (
              <RadioButton key={p} value={p} labelText={p} id={p} />
            ))}
          </RadioButtonGroup>
          <div style={{ marginBottom: '10px' }} />
          <hr />
          <div style={{ marginBottom: '10px' }} />
          <Select
            id="received"
            labelText="How was the student received?"
            defaultValue={formState && formState.received}
            onChange={e =>
              setFormState({ ...formState, received: e.target.value })
            }
          >
            {/* <SelectItem value="" text={'Select...'} /> */}
            {RECEIVED_STATES.map(received => (
              <SelectItem key={received} value={received} text={received} />
            ))}
          </Select>
          <div style={{ marginBottom: '10px' }} />
          <TextInput
            type="text"
            size="sm"
            labelText="Activity Name"
            placeholder="Crossword puzzles"
            value={formState && formState.participated_in}
            onChange={e =>
              setFormState({ ...formState, participated_in: e.target.value })
            }
          />
          <div style={{ marginBottom: '10px' }} />
          <MultiSelect
            id="targeted_skills"
            titleText="Targeted Skills"
            label="Targeted skills"
            items={TARGETED_SKILLS}
            itemToString={i => i}
            onChange={e =>
              setFormState({ ...formState, targeted_skills: e.selectedItems })
            }
          />
          <div style={{ marginBottom: '10px' }} />

          <p>
            <strong>Quick Set Accuracy Level: </strong>
          </p>
          <ul style={{ display: 'inline' }}>
            {[25, 50, 75, 80, 90, 100].map(pc => (
              <Button
                style={{ width: '25px' }}
                size="sm"
                kind="secondary"
                onClick={e =>
                  setFormState({ ...formState, accuracy_level: `${pc}` })
                }
              >
                {pc}%
              </Button>
            ))}
          </ul>
          <div style={{ marginBottom: '10px' }} />
          <TextInput
            type="text"
            size="sm"
            labelText="Accuracy Level (omit the % symbol)"
            placeholder="25"
            value={formState && formState.accuracy_level}
            onChange={e => {
              let value = e.target.value
              value = value.replaceAll(/%/g, '')
              setFormState({ ...formState, accuracy_level: value })
            }}
          />
          <div style={{ marginBottom: '10px' }} />
          <Select
            id="prompt_level"
            labelText="Prompt Level"
            value={formState && formState.prompt_level}
            onChange={e =>
              setFormState({ ...formState, prompt_level: e.target.value })
            }
          >
            <SelectItem value="" text={'Select a prompt level'} />
            {PROMPT_LEVELS.map(promptLevel => (
              <SelectItem value={promptLevel} text={promptLevel} />
            ))}
          </Select>
          <div style={{ marginBottom: '10px' }} />

          <MultiSelect
            id="prompt_types"
            titleText="Prompt Type(s)"
            label={formState.prompt_types.join(', ') || 'Prompt Type'}
            items={PROMPT_TYPES}
            itemToString={i => i}
            onChange={e =>
              setFormState({ ...formState, prompt_types: e.selectedItems })
            }
          />
          <div style={{ marginBottom: '10px' }} />

          <div style={{ paddingLeft: '1rem' }}>
            {formState &&
              formState.prompt_types &&
              formState.prompt_types.length > 0 &&
              formState.prompt_types.map(pt => (
                <>
                  <MultiSelect
                    id="prompt_types"
                    titleText={`Select ${pt} subtypes (optional)`}
                    label={pt}
                    items={PROMPT_TYPE_SUBTYPE_MAP[pt]}
                    itemToString={i => i}
                    onChange={e => {
                      setFormState({
                        ...formState,
                        prompt_subtypes: {
                          ...formState.prompt_subtypes,
                          [pt]: e.selectedItems,
                        },
                      })
                    }}
                  />
                  <div style={{ marginBottom: '10px' }} />
                </>
              ))}
          </div>
        </Form>
      </div>
      <div className={styles.right}>
        <h2 style={{ userSelect: 'none' }}>Report Text</h2>
        <p className={styles.output}>{output}</p>
      </div>
    </div>
  )
}

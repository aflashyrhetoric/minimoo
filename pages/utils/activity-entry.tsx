import React from 'react'
import { upperFirst } from 'lodash'
import {
  TextInput,
  MultiSelect,
  Button,
  Select,
  SelectItem,
} from 'carbon-components-react'
import { COLORS } from './shared'
import {
  PROMPT_LEVELS,
  PROMPT_TYPES,
  SessionActivity,
  TARGETED_SKILLS,
} from './types'
import SpecificPromptEntry from './SpecificPromptEntry'
import SpecificSkillEntry from './SpecificSkillEntry'

const styles = require('./session-note-generator.module.scss')

interface ActivityEntryProps {
  activity: SessionActivity
  setFormState: Function
}

const ActivityEntry: React.FC<ActivityEntryProps> = ({
  activity = {} as SessionActivity,
  setFormState,
}: ActivityEntryProps) => {
  return (
    <div className={styles.activityEntry} style={{ padding: '0.5rem' }}>
      <div className={styles.colorContainer}>
        <div
          style={{
            background: COLORS.activity_name,
          }}
        ></div>
        <TextInput
          light
          id="activity_name"
          type="text"
          size="sm"
          labelText="Activity Name"
          placeholder="repeated /r/ sounds"
          value={activity && activity.activity_name}
          onChange={e =>
            setFormState({
              ...activity,
              activity_name: e.target.value,
            })
          }
        />
      </div>
      <div style={{ marginBottom: '10px' }} />
      <div className={styles.colorContainer}>
        <div
          style={{
            background: COLORS.targeted_skills,
          }}
        ></div>
        <MultiSelect
          light
          id="targeted_skills"
          titleText="Targeted Skills"
          label={
            (activity &&
              activity.targeted_skills &&
              activity.targeted_skills.join(', ')) ||
            'Targeted skills'
          }
          items={TARGETED_SKILLS}
          itemToString={i => i}
          style={{ width: '100%' }}
          onChange={e =>
            setFormState({
              ...activity,
              targeted_skills: e.selectedItems,
            })
          }
        />
      </div>
      <div style={{ marginBottom: '10px' }} />
      <div style={{ paddingLeft: '1rem' }}>
        {activity &&
          activity.targeted_skills &&
          activity.targeted_skills.length > 0 &&
          activity.targeted_skills.map(skill => (
            <SpecificSkillEntry
              skill={skill}
              setFormState={(skillDetails: string) => {
                setFormState({
                  ...activity,
                  targeted_skill_details: {
                    ...activity.targeted_skill_details,
                    [skill]: skillDetails,
                  },
                })
              }}
            />
          ))}
      </div>
      <div style={{ marginBottom: '10px' }} />

      <div>
        <div></div>
        <div>
          <p>
            <strong>Quick-Set Accuracy Level: </strong>
          </p>
        </div>
      </div>
      <ul style={{ display: 'inline' }}>
        {[25, 50, 75, 80, 90, 100].map(pc => (
          <Button
            key={`${pc}-button`}
            style={{ width: '25px' }}
            size="sm"
            kind="secondary"
            onClick={e =>
              setFormState({ ...activity, accuracy_level: `${pc}` })
            }
          >
            {pc}%
          </Button>
        ))}
      </ul>
      <div style={{ marginBottom: '10px' }} />
      <div className={styles.colorContainer}>
        <div
          style={{
            background: COLORS.accuracy_level,
          }}
        ></div>
        <TextInput
          light
          id="accuracy_level"
          type="text"
          size="sm"
          labelText="Accuracy Level (omit the % symbol)"
          placeholder="25"
          value={activity && activity.accuracy_level}
          onChange={e => {
            let value = e.target.value
            value = value.replaceAll(/%/g, '')
            setFormState({ ...activity, accuracy_level: value })
          }}
        />
      </div>
      <div style={{ marginBottom: '10px' }} />
      <div className={styles.colorContainer}>
        <div
          style={{
            background: COLORS.prompt_level,
          }}
        ></div>
        <Select
          light
          id="prompt_level"
          labelText="Prompt Level"
          value={(activity && activity.prompt_level) || PROMPT_LEVELS[0]}
          onChange={e =>
            setFormState({ ...activity, prompt_level: e.target.value })
          }
        >
          <SelectItem value="" text={'Select a prompt level'} />
          {PROMPT_LEVELS.map(promptLevel => (
            <SelectItem
              key={promptLevel}
              value={promptLevel}
              text={promptLevel}
            />
          ))}
        </Select>
      </div>
      <div style={{ marginBottom: '10px' }} />
      <div className={styles.colorContainer}>
        <div
          style={{
            background: COLORS.cuesString,
          }}
        ></div>
        <MultiSelect
          light
          id="prompt_types"
          titleText="Prompt Type(s)"
          label={
            // (activity && activity.prompts && activity.prompts.join(', ')) ||
            'Prompt Type'
          }
          items={PROMPT_TYPES}
          itemToString={i => i}
          onChange={e => {
            setFormState({
              ...activity,
              prompts: e.selectedItems,
            })
          }}
        />
      </div>
      <div style={{ marginBottom: '20px' }} />

      <div style={{ marginLeft: '1rem' }}>
        {activity &&
          activity.prompts &&
          activity.prompts.length > 0 &&
          activity.prompts.map((pt, index) => (
            <>
              <SpecificPromptEntry
                prompt={pt}
                setFormState={specific_prompts => {
                  setFormState({
                    ...activity,
                    specific_prompts: {
                      ...activity.specific_prompts,
                      [pt]: specific_prompts,
                    },
                  })
                }}
              />
            </>
          ))}
      </div>
    </div>
  )
}

export default ActivityEntry

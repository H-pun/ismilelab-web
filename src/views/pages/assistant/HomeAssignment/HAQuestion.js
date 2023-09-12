import { Link, useNavigate } from 'react-router-dom'

// ** Styles
import '@styles/react/libs/editor/editor.scss'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Icons Imports
import * as Icon from 'react-feather'
import { Edit, HelpCircle, PlusSquare } from 'react-feather'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { addQuestion } from '@store/api/homeAssignmentQuestion'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Button, Label, Form } from 'reactstrap'

const defaultValues = {
  question: EditorState.createEmpty(),
  answerKey: EditorState.createEmpty()
}

const HAQuestion = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    control,
    handleSubmit
  } = useForm({ defaultValues })

  const onSubmit = data => {
    if (Object.values(data).every(field => field.blocks)) {
      dispatch(addQuestion({
        question: draftToHtml(data.question),
        answerKey: draftToHtml(data.answerKey)
      })).then(() => {
        navigate('/assistant/preliminary-assignment/question-list')
      })
    } else {
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Card className='question-item'>
        <CardHeader className='question-title'>
          <div className='d-flex'>
            <Avatar className='rounded' color='light-info' icon={<HelpCircle size={20} />} />
            <div className='title'>
              <h4>Module 1</h4>
            </div>
          </div>
          <div>
            <Button color='relief-success' type='submit'>
              <Edit size={14} />
              <span className='align-middle'> Add</span>
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="mb-1">
            <Label className="form-label" for="field-question">
              <h5>Question</h5>
            </Label>
            <Controller
              name='question'
              control={control}
              render={({ field }) => (
                <Editor
                  id='field-question'
                  placeholder='Enter the question here...'
                  {...field} />
              )}
            />
          </div>
          <div className="mb-1">
            <Label className="form-label" for="field-answer">
              <h5>Answer Key</h5>
            </Label>
            <Controller
              name='answerKey'
              control={control}
              render={({ field }) => (
                <Editor
                  id='field-answer'
                  placeholder='Enter the answer key here...'
                  {...field} />
              )}
            />
          </div>
        </CardBody>
      </Card>
    </Form>
  )
}

export default HAQuestion
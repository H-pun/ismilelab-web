// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss"

// ** Third Party Components
import { Fragment } from 'react'
import { Edit, FileText, Trash } from 'react-feather'
import { NavLink, useNavigate } from 'react-router-dom'
import DataTable, { createTheme } from "react-data-table-component"
import Select from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Breadcrumbs from '@components/breadcrumbs'

// ** Utils
import { selectThemeColors } from '@utils'
import { useSkin } from "@hooks/useSkin"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Label, Button, Spinner, ListGroup, ListGroupItem, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getInputResult, getInputPreview, deleteInputResult, getInputDetail, setModule } from '@store/api/seelabs'
import { getAllSubmissions } from '@store/api/module'

const MySwal = withReactContent(Swal)

createTheme("dark", {
  background: {
    default: "transparent"
  }
})

const InputResult = () => {
  const { skin } = useSkin()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    moduleOptions,
    currentModule,
    inputScoreResult,
    isSubmitLoading,
    isLoading } = useSelector(state => state.seelabs)

  const handleDelete = async param => {
    return await MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(result => {
      if (result.value) {
        dispatch(deleteInputResult(param)).unwrap()
          .then(({ status }) => {
            if (status === 200) {
              MySwal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              })
              dispatch(getInputResult({ module: currentModule.value }))
            }
          })
          .catch(() => {
            MySwal.fire({
              title: 'Failed',
              text: 'Something wrong...',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            })
          })
      }
    })
  }

  const basicColumns = [
    {
      name: 'Group',
      maxWidth: '150px',
      center: true,
      selector: row => row.group
    },
    {
      name: 'Names',
      minWidth: '300px',
      cell: ({ names }) => (
        <ListGroup flush style={{ width: '100%' }}>
          {names.map((name, index) => (
            <ListGroupItem
              key={index}
              style={{ backgroundColor: 'transparent', paddingLeft: '0px' }}>
              {name}
            </ListGroupItem>
          ))}
        </ListGroup>
      )
    },
    {
      name: 'Action',
      button: true,
      minWidth: '300px',
      cell: row => (
        <div className='d-flex flex-column gap-1'>
          <UncontrolledButtonDropdown>
            <NavLink to="/assistant/input-result/preview">
              <Button outline color='primary' onClick={() => dispatch(getInputPreview({ module: currentModule.value, group: row.group }))}>
                <FileText size={15} />
                <span className='align-middle ms-25'>Preview</span>
              </Button>
            </NavLink>
            <DropdownToggle className='dropdown-toggle-split' color='primary' caret></DropdownToggle>
            <DropdownMenu>
              <DropdownItem href='/' tag='a' onClick={e => {
                e.preventDefault()
                dispatch(getAllSubmissions({
                  seelabsId: currentModule.value,
                  group: row.group
                }))
                dispatch(getInputDetail({
                  module: currentModule.value,
                  group: row.group
                }))
                navigate('/assistant/input-result/update-score')
              }}>
                <Edit size={15} />
                <span className='align-middle ms-50'>Edit</span>
              </DropdownItem>
              <DropdownItem href='/' tag='a' onClick={e => {
                e.preventDefault()
                handleDelete(({ module: currentModule.value, group: row.group }))
              }}>
                <Trash size={15} />
                <span className='align-middle ms-50'>Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </div>
      )
    }
  ]

  return (
    <Fragment>
      <Breadcrumbs title='Input Result' data={[{ title: 'Group List' }]} />
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Group List</CardTitle>
        </CardHeader>

        <CardBody>
          <Row>
            {/* FIELD INI GA DIPAKAI SEHARUSNYA */}
            <Col className='mb-1' md='4' sm='12'>
              <Label className='form-label'>Select Module</Label>
              <Select
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                options={moduleOptions}
                value={currentModule}
                isDisabled={isLoading || isSubmitLoading}
                onChange={(selectedOption) => {
                  dispatch(getInputResult({ module: selectedOption.value }))
                  dispatch(setModule(selectedOption))
                }}
              />
            </Col>
          </Row>
          <Row>
            <DataTable
              noHeader
              data={inputScoreResult}
              columns={basicColumns}
              progressPending={isLoading}
              theme={skin}
              className="react-dataTable my-1"
              progressComponent={
                <div className="d-flex justify-content-center my-1">
                  <Spinner color="primary" />
                </div>
              }
            />
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  )
}
export default InputResult

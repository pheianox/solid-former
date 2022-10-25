import { createSignal } from 'solid-js'

export type Options<T> = Partial<FlagOptions & CallbackOptions<T>> & ResourceOptions<T>
export type Config<T> = FlagOptions & CallbackOptions<T> & ResourceOptions<T>
export type Fields<T> = Record<keyof T, { name: keyof T, value: any, error: string | undefined }>
export type Validator<T> = (fields: T) => boolean | ValidationError<T>
export type ValidationError<T> = Partial<Record<keyof T, string>>

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export interface FlagOptions {
  validateOnInput: boolean
  stopAtFirstError: boolean
}

export interface CallbackOptions<T> {
  onSubmit: (fields: T) => void
  onChange: (fields: Fields<T>) => void
}

export interface ResourceOptions<T> {
  fields: T
  validators: Validator<T>[]
}

const defaultConfig: Config<any> = {
  fields: {},
  validators: [],
  onChange: () => null,
  onSubmit: () => null,
  validateOnInput: false,
  stopAtFirstError: true,
}

export function createForm<T extends Record<keyof T, any>>(config: Options<T>) {
  const options = { ...defaultConfig, ...config } as Config<T>

  const initialFields = dataToFields(options.fields)
  const [fields, setFields] = createSignal(initialFields)
  const [isValid, setIsValid] = createSignal(true)
  const [isTouched, setIsTouched] = createSignal(false)

  function input(fieldName: keyof T, fieldValue: any) {
    setFields(fields => ({ ...fields, [fieldName]: { ...fields[fieldName], value: fieldValue } }))
    if (options.validateOnInput) validate()
    if (!isTouched()) setIsTouched(true)
    options.onChange(fieldsToData(fields()))
  }

  function reset() {
    setFields(() => initialFields)
  }

  function submit() {
    if (!options.validateOnInput) validate()
    if (isValid()) options.onSubmit?.(fieldsToData(fields()))
  }

  function validate() {
    const capturedFields = fields()

    for (const fieldName in capturedFields) {
      delete capturedFields[fieldName].error
    }

    const validationInput = fieldsToData(capturedFields)
    const validationResult = options.validators.map(validator => validator(validationInput))
    const validationErrors = validationResult.filter(result => typeof result === "object") as ValidationError<T>[]

    if (options.stopAtFirstError && validationErrors.length > 1) {
      validationErrors.length = 1
    }

    for (const validaitionError of validationErrors) {
      try {
        const validationErrorEntries = Object.entries(validaitionError) as Entries<ValidationError<T>>
        const [fieldKey, errorMessage] = validationErrorEntries[0]
        capturedFields[fieldKey].error = errorMessage
      } finally {
      }
    }

    setFields(() => ({ ...capturedFields }))
    const isValid = validationErrors.length <= 0
    setIsValid(isValid)
    return isValid
  }

  function dataToFields(data: T) {
    return (Object.entries(data) as Entries<T>)
      .reduce((result, [fieldName, fieldValue]) => ({
        ...result,
        [fieldName]: {
          name: fieldName,
          value: fieldValue,
          error: null
        }
      }), {} as Fields<T>)
  }

  function fieldsToData(fields: Fields<T>) {
    return Object
      .entries(fields as Fields<any>)
      .reduce((data, [fieldKey, field]) => ({
        ...data,
        [fieldKey]: field.value
      }), {} as T)
  }

  return { fields, isValid, isTouched, input, reset, submit }
}
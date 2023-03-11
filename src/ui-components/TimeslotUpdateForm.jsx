/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Timeslot } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button
            size="small"
            variation="link"
            isDisabled={hasError}
            onClick={addItem}
          >
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function TimeslotUpdateForm(props) {
  const {
    id: idProp,
    timeslot,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    startTime: "",
    endTime: "",
    unavailableDates: [],
    volunteerBookings: [],
    riderBookings: [],
  };
  const [startTime, setStartTime] = React.useState(initialValues.startTime);
  const [endTime, setEndTime] = React.useState(initialValues.endTime);
  const [unavailableDates, setUnavailableDates] = React.useState(
    initialValues.unavailableDates
  );
  const [volunteerBookings, setVolunteerBookings] = React.useState(
    initialValues.volunteerBookings
  );
  const [riderBookings, setRiderBookings] = React.useState(
    initialValues.riderBookings
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = timeslotRecord
      ? { ...initialValues, ...timeslotRecord }
      : initialValues;
    setStartTime(cleanValues.startTime);
    setEndTime(cleanValues.endTime);
    setUnavailableDates(cleanValues.unavailableDates ?? []);
    setCurrentUnavailableDatesValue("");
    setVolunteerBookings(cleanValues.volunteerBookings ?? []);
    setCurrentVolunteerBookingsValue("");
    setRiderBookings(cleanValues.riderBookings ?? []);
    setCurrentRiderBookingsValue("");
    setErrors({});
  };
  const [timeslotRecord, setTimeslotRecord] = React.useState(timeslot);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(Timeslot, idProp)
        : timeslot;
      setTimeslotRecord(record);
    };
    queryData();
  }, [idProp, timeslot]);
  React.useEffect(resetStateValues, [timeslotRecord]);
  const [currentUnavailableDatesValue, setCurrentUnavailableDatesValue] =
    React.useState("");
  const unavailableDatesRef = React.createRef();
  const [currentVolunteerBookingsValue, setCurrentVolunteerBookingsValue] =
    React.useState("");
  const volunteerBookingsRef = React.createRef();
  const [currentRiderBookingsValue, setCurrentRiderBookingsValue] =
    React.useState("");
  const riderBookingsRef = React.createRef();
  const validations = {
    startTime: [],
    endTime: [],
    unavailableDates: [],
    volunteerBookings: [],
    riderBookings: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          startTime,
          endTime,
          unavailableDates,
          volunteerBookings,
          riderBookings,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          await DataStore.save(
            Timeslot.copyOf(timeslotRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "TimeslotUpdateForm")}
      {...rest}
    >
      <TextField
        label="Start time"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={startTime}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              startTime: value,
              endTime,
              unavailableDates,
              volunteerBookings,
              riderBookings,
            };
            const result = onChange(modelFields);
            value = result?.startTime ?? value;
          }
          if (errors.startTime?.hasError) {
            runValidationTasks("startTime", value);
          }
          setStartTime(value);
        }}
        onBlur={() => runValidationTasks("startTime", startTime)}
        errorMessage={errors.startTime?.errorMessage}
        hasError={errors.startTime?.hasError}
        {...getOverrideProps(overrides, "startTime")}
      ></TextField>
      <TextField
        label="End time"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={endTime}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              startTime,
              endTime: value,
              unavailableDates,
              volunteerBookings,
              riderBookings,
            };
            const result = onChange(modelFields);
            value = result?.endTime ?? value;
          }
          if (errors.endTime?.hasError) {
            runValidationTasks("endTime", value);
          }
          setEndTime(value);
        }}
        onBlur={() => runValidationTasks("endTime", endTime)}
        errorMessage={errors.endTime?.errorMessage}
        hasError={errors.endTime?.hasError}
        {...getOverrideProps(overrides, "endTime")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              startTime,
              endTime,
              unavailableDates: values,
              volunteerBookings,
              riderBookings,
            };
            const result = onChange(modelFields);
            values = result?.unavailableDates ?? values;
          }
          setUnavailableDates(values);
          setCurrentUnavailableDatesValue("");
        }}
        currentFieldValue={currentUnavailableDatesValue}
        label={"Unavailable dates"}
        items={unavailableDates}
        hasError={errors?.unavailableDates?.hasError}
        errorMessage={errors?.unavailableDates?.errorMessage}
        setFieldValue={setCurrentUnavailableDatesValue}
        inputFieldRef={unavailableDatesRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Unavailable dates"
          isRequired={false}
          isReadOnly={false}
          type="date"
          value={currentUnavailableDatesValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.unavailableDates?.hasError) {
              runValidationTasks("unavailableDates", value);
            }
            setCurrentUnavailableDatesValue(value);
          }}
          onBlur={() =>
            runValidationTasks("unavailableDates", currentUnavailableDatesValue)
          }
          errorMessage={errors.unavailableDates?.errorMessage}
          hasError={errors.unavailableDates?.hasError}
          ref={unavailableDatesRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "unavailableDates")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              startTime,
              endTime,
              unavailableDates,
              volunteerBookings: values,
              riderBookings,
            };
            const result = onChange(modelFields);
            values = result?.volunteerBookings ?? values;
          }
          setVolunteerBookings(values);
          setCurrentVolunteerBookingsValue("");
        }}
        currentFieldValue={currentVolunteerBookingsValue}
        label={"Volunteer bookings"}
        items={volunteerBookings}
        hasError={errors?.volunteerBookings?.hasError}
        errorMessage={errors?.volunteerBookings?.errorMessage}
        setFieldValue={setCurrentVolunteerBookingsValue}
        inputFieldRef={volunteerBookingsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Volunteer bookings"
          isRequired={false}
          isReadOnly={false}
          value={currentVolunteerBookingsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.volunteerBookings?.hasError) {
              runValidationTasks("volunteerBookings", value);
            }
            setCurrentVolunteerBookingsValue(value);
          }}
          onBlur={() =>
            runValidationTasks(
              "volunteerBookings",
              currentVolunteerBookingsValue
            )
          }
          errorMessage={errors.volunteerBookings?.errorMessage}
          hasError={errors.volunteerBookings?.hasError}
          ref={volunteerBookingsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "volunteerBookings")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              startTime,
              endTime,
              unavailableDates,
              volunteerBookings,
              riderBookings: values,
            };
            const result = onChange(modelFields);
            values = result?.riderBookings ?? values;
          }
          setRiderBookings(values);
          setCurrentRiderBookingsValue("");
        }}
        currentFieldValue={currentRiderBookingsValue}
        label={"Rider bookings"}
        items={riderBookings}
        hasError={errors?.riderBookings?.hasError}
        errorMessage={errors?.riderBookings?.errorMessage}
        setFieldValue={setCurrentRiderBookingsValue}
        inputFieldRef={riderBookingsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Rider bookings"
          isRequired={false}
          isReadOnly={false}
          value={currentRiderBookingsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.riderBookings?.hasError) {
              runValidationTasks("riderBookings", value);
            }
            setCurrentRiderBookingsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("riderBookings", currentRiderBookingsValue)
          }
          errorMessage={errors.riderBookings?.errorMessage}
          hasError={errors.riderBookings?.hasError}
          ref={riderBookingsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "riderBookings")}
        ></TextField>
      </ArrayField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || timeslot)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || timeslot) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}

"use client";
import PlatformNavbar from "@/components/platformnavbar";
import {
  Card,
  Checkbox,
  Collapse,
  Input,
  Button,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Alert,
} from "@material-tailwind/react";
import { useState, KeyboardEvent } from "react";
import {
  useForm,
  Controller,
  useFieldArray,
  SubmitHandler,
} from "react-hook-form";
import { TagComponent } from "./tagDisplayComponent";
import { LinkComponent } from "./linkDisplayComponent";
// actions
import { getUsername, submitProfileForm } from "@/app/actions/profileForm";
// Yup schema validation
import { yupResolver } from "@hookform/resolvers/yup";

import { object, string, array } from "yup";
import { GoAlert } from "react-icons/Go";
import { ErrorMessage } from "@hookform/error-message";
import { AiOutlineCheckCircle } from "react-icons/ai";

export type FormValues = {
  username: string;
  name: string;
  headline: string;
  tags: string[];
  links: string[];
  tools: string[];
  temporaryTag: string | undefined;
  temporaryLink: string | undefined;
};

// src: https://stackoverflow.com/questions/61634973/yup-validation-of-website-using-url-very-strict
const urlRegex =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

//TODO: Remove .test from schema because it queries every time input is re-validated
const schema = object().shape({
  username: string()
    .max(20, "Username can only be 20 characters long.")
    .test("is-unique-username", "Username is taken", (value) =>
      getUsername(value).then(async (username) => {
        console.log("In here");
        return username === null;
      })
    )
    .required("Please enter a unique username"),
  name: string().max(50, "Name can only be 50 characters long").required(),
  headline: string().max(40, "Headline can only be 15 ch").required(),
  tags: array().of(string().required()).min(1).max(3).required(),
  links: array().of(string().required()).min(1).max(3).required(),
  tools: array().of(string().required()).min(1).max(5).required(),
  temporaryTag: string()
    .max(10, "Each tag can only  be 10 characters long")
    .optional(),
  temporaryLink: string()
    .matches(
      urlRegex,
      "Not a valid URL. May need to delete a link and try again"
    )
    .optional(),
});

export default function ProfilePageComponent() {
  // ----------form----------------

  const {
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    setError,
    trigger,
    unregister,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    criteriaMode: "all", // needed for alert
    resolver: yupResolver(schema),
  });
  const {
    fields: tagField,
    append: tagAppend,
    remove: tagRemove,
  } = useFieldArray({ control, name: "tags" } as never);

  const {
    fields: linkField,
    append: linkAppend,
    remove: linkRemove,
  } = useFieldArray({ control, name: "links" } as never);
  const {
    fields: toolsField,
    append: toolsAppend,
    remove: toolsRemove,
  } = useFieldArray({ control, name: "tools" } as never);

  // ---------tag display----------------
  const handleKeyDownTags = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleTagAddButton();
    }
  };
  const handleTagAddButton = async () => {
    const tagVal = getValues("temporaryTag");

    const valid = await trigger("temporaryTag");
    if (valid) {
      // TODO: Limit number of tags and check if valid
      tagAppend(tagVal);
      setValue("temporaryTag", "");
    } else {
      return;
    }
  };

  // ---------link display----------------
  const handleKeyDownLinks = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log("EVENT==>", event);
      handleLinkAddButton();
    }
  };
  const handleLinkAddButton = async () => {
    const linkVal = getValues("temporaryLink");
    console.log("LINK VAL => ", linkVal);
    const valid = await trigger("temporaryLink");
    if (linkVal && valid) {
      linkAppend(linkVal);
      setValue("temporaryLink", "");
      unregister("temporaryLink"); // need this to prevent invalid url on Submit
    } else {
      //todo: set error
      return;
    }
  };
  // ---------collapse----------------
  const [open, setOpen] = useState<boolean>(false);
  const toggleOpen = () => setOpen((cur) => !cur);
  // -------------------------

  const toolList: string[] = [
    "Python",
    "Golang",
    "C++",
    "AWS",
    "Google Cloud",
    "Typescript",
    "node.js",
    "Rust",
    "OCaml",
    "Photoshop",
    "chatGPT",
    "Vim",
    "neoVim",
    "VsCode",
  ];
  // username alert icon, inside input
  const [validUsername, setValidUsername] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    console.log(data);

    submitProfileForm(data);
  };
  return (
    <>
      <PlatformNavbar />
      <div className="flex items-center justify-center">
        <p className="text-white">{JSON.stringify(watch(), null, 2)}</p>
      </div>
      <div className="flex  justify-center">
        <Card color="transparent" shadow={false}>
          <Typography variant="h4" color="white">
            Create notespace profile
          </Typography>
          <Typography color="white" className="mt-1 font-normal">
            Enter your details.
          </Typography>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          >
            <div className="mb-4 flex flex-col gap-6">
              {/*Errors*/}
              <ErrorMessage
                errors={errors}
                name="username"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <Alert
                      key={type}
                      color="red"
                      icon={<GoAlert size={"1.5rem"} />}
                    >
                      {message}
                    </Alert>
                  ))
                }
              />
              <ErrorMessage
                errors={errors}
                name="name"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <Alert
                      key={type}
                      color="red"
                      icon={<GoAlert size={"1.5rem"} />}
                    >
                      {message}
                    </Alert>
                  ))
                }
              />
              <ErrorMessage
                errors={errors}
                name="headline"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <Alert
                      key={type}
                      color="red"
                      icon={<GoAlert size={"1.5rem"} />}
                    >
                      {message}
                    </Alert>
                  ))
                }
              />

              <ErrorMessage
                errors={errors}
                name="tags"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <Alert
                      key={type}
                      color="red"
                      icon={<GoAlert size={"1.5rem"} />}
                    >
                      {message}
                    </Alert>
                  ))
                }
              />

              <ErrorMessage
                errors={errors}
                name="links"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <Alert
                      key={type}
                      color="red"
                      icon={<GoAlert size={"1.5rem"} />}
                    >
                      {message}
                    </Alert>
                  ))
                }
              />

              <ErrorMessage
                errors={errors}
                name="tools"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <Alert
                      key={type}
                      color="red"
                      icon={<GoAlert size={"1.5rem"} />}
                    >
                      {message}
                    </Alert>
                  ))
                }
              />

              <ErrorMessage
                errors={errors}
                name="temporaryTag"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <Alert
                      key={type}
                      color="red"
                      icon={<GoAlert size={"1.5rem"} />}
                    >
                      {message}
                    </Alert>
                  ))
                }
              />

              <ErrorMessage
                errors={errors}
                name="temporaryLink"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <Alert
                      key={type}
                      color="red"
                      icon={<GoAlert size={"1.5rem"} />}
                    >
                      {message}
                    </Alert>
                  ))
                }
              />
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <Input
                    size="lg"
                    color="white"
                    label="Unique username"
                    onChange={onChange}
                    icon={
                      validUsername && (
                        <AiOutlineCheckCircle className="fill-green-500" />
                      )
                    }
                    onBlur={(e) => {
                      getUsername(e.target.value).then((username) => {
                        if (username) {
                          setValidUsername(false);
                          console.log("Username not unique");
                        } else {
                          console.log("Username available");
                          setValidUsername(true);
                        }
                      });
                    }}
                    value={value}
                  />
                )}
              />
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    size="lg"
                    color="white"
                    label="Name"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
              <Controller
                control={control}
                name="headline"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    size="lg"
                    color="white"
                    label="Headline"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
            </div>
            <div className="relative flex w-full max-w-[24rem]">
              <Controller
                control={control}
                name="temporaryTag"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Add up to 3 tags"
                    color="white"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    onKeyDown={handleKeyDownTags}
                    className="pr-20"
                    containerProps={{
                      className: "min-w-0",
                    }}
                  />
                )}
              />
              <Button
                size="sm"
                type="button"
                disabled={false}
                className="!absolute right-1 top-1 rounded bg-noto-purple"
                onClick={handleTagAddButton}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 py-2">
              <TagComponent
                tagsToShow={getValues("tags")}
                removeTag={tagRemove}
              />
            </div>
            <div className="relative flex w-full max-w-[24rem]">
              <Controller
                control={control}
                name="temporaryLink"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Add up to 3 links"
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDownLinks}
                    className="pr-20"
                    color="white"
                    containerProps={{
                      className: "min-w-0",
                    }}
                  />
                )}
              />
              <Button
                size="sm"
                type="button"
                disabled={false}
                className="!absolute right-1 top-1 rounded bg-noto-purple"
                onClick={handleLinkAddButton}
              >
                Add
              </Button>
            </div>
            <div className="flex-col items-center gap-2 py-2">
              <LinkComponent
                linksToShow={getValues("links")}
                removeLink={linkRemove}
              />
            </div>
            <div className="flex justify-center">
              <Button
                type="button"
                color="white"
                variant="outlined"
                onClick={toggleOpen}
                fullWidth
              >
                Select tools
              </Button>
            </div>
            <Collapse open={open}>
              <Card className="w-full max-w-[24rem]">
                <List className="flex flex-wrap">
                  {toolList.map((tool, index) => (
                    <ListItem key={index} className="p-0">
                      <label
                        htmlFor="horizontal-list-react"
                        className="flex w-full cursor-pointer items-center px-3 py-2"
                      >
                        <ListItemPrefix className="mr-3">
                          <Controller
                            name="tools"
                            control={control}
                            render={({ field: { value } }) => (
                              <Checkbox
                                id="horizontal-list-react"
                                ripple={false}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    // add it to tools array
                                    toolsAppend(tool);
                                  } else {
                                    // remove from tools array
                                    const toolsArr = getValues("tools");
                                    toolsRemove(
                                      toolsArr.findIndex(
                                        (item) => item === tool
                                      )
                                    );
                                  }
                                }}
                                value={value}
                                color="gray"
                                className="hover:before:opacity-0 border-noto-purple"
                                containerProps={{
                                  className: "p-0",
                                }}
                              />
                            )}
                          />
                        </ListItemPrefix>
                        <Typography color="blue-gray" className="font-medium">
                          {tool}
                        </Typography>
                      </label>
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Collapse>

            <Button
              onClick={handleSubmit(onSubmit)}
              className="mt-6 bg-noto-purple "
              fullWidth
            >
              Update
            </Button>
            {/*Icon hashmap proof of concept */}
          </form>
        </Card>
      </div>
    </>
  );
}

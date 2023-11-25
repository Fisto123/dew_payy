import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function SelectOpt({ itemsMenu, title, onChange, value }) {
  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 150, width: "100%" }}>
        <InputLabel id="demo-simple-select-filled-label">{title}</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          defaultValue={value}
          label={title}
          onChange={onChange} // Pass the callback function from the parent
        >
          <MenuItem value="">
            <em>Choose one</em>
          </MenuItem>
          {itemsMenu.map((item, i) => (
            <MenuItem key={i} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

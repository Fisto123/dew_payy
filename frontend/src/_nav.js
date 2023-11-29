import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilChartPie,
  cilCursor,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
} from "@coreui/icons";
import { CNavGroup, CNavItem } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "CORPORATE MANAGEMENT",
    to: "/corporate-management",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "CORPORATE SETTINGS",
    to: "/corporate",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "TRANSACTIONS",
    to: "/transactions",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "DEPARTMENT MANAGEMENT",
    to: "/department-management",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "TERMINAL MANAGEMENT",
    to: "/terminal-management",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "BILLER MANAGEMENT",
    to: "/biller-management",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "USER MANAGEMENT",
    to: "/user-management",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: "DEPARTMENT MANAGEMENT",
    to: "/department-management",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: "BILLER MANAGEMENT",
    to: "/biller-management",
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: "USER MANAGEMENT",
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "LOGOUT",
    to: "/login",
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
];

export default _nav;

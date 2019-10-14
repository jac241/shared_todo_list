/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

require("@rails/ujs").start()
import 'turbolinks'
require("channels")

import $ from 'jquery'
global.$ = $
global.jQuery = $

require('src/cocoon')

import 'bootstrap'
import 'data-confirm-modal'
import './src/application.scss'

import '@client-side-validations/client-side-validations'
import '@client-side-validations/simple-form/dist/simple-form.bootstrap4'

import { Application } from "stimulus"
import { definitionsFromContext } from "stimulus/webpack-helpers"

const application = Application.start()
const context = require.context("controllers", true, /.js$/)
application.load(definitionsFromContext(context))

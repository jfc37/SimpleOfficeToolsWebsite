# Website Analytics

The production website uses the GA4 property `G-97B467N03C` through
`assets/js/analytics.js`. Google Analytics is optional and is not loaded until a
visitor chooses **Allow analytics**.

Development purchase-flow pages (`pricing-dev.html`, `checkout-dev.html`, and
`purchase-completed-dev.html`) intentionally do not load the production analytics
property.

## Consent behaviour

- The visitor's choice is stored locally under
  `simple-office-tools-analytics-consent`.
- Before a choice is made, website analytics events are discarded rather than
  queued for later replay.
- Allowing analytics loads GA4 and sends the current page view.
- Declining analytics does not load GA4.
- Withdrawing consent stops future events and removes accessible `_ga` and
  `_ga_*` cookies.
- Ad storage, Google signals, and ad-personalisation signals remain disabled.
- **Cookie settings** in the website footer reopens the choice.

## Event catalogue

### Navigation and calls to action

- `nav_menu_toggle`
- `nav_link_click`
- `cta_trial_click`
- `download_appinstaller_click`
- `cta_buy_click`
- `cta_pricing_click`
- `cta_features_click`
- `cta_simply_sign_click`
- `cta_privacy_click`
- `charity_licence_click`
- `support_contact_click`
- `video_library_click`

### Content engagement

- `section_view`
- `page_scroll` at 25, 50, 75, and 90 percent
- `faq_expand`
- `video_start`
- `video_progress` at 25, 50, and 75 percent
- `video_complete`
- `savings_calculator_update`

### Checkout and post-purchase

- `begin_checkout`
- `purchase`
- `checkout_closed`
- `checkout_error`
- `checkout_unavailable`
- `purchase_completed_page_view`
- `purchase_id_copy`
- `purchase_app_handoff`
- `post_purchase_download_click`

`begin_checkout` and `purchase` follow the GA4 ecommerce item shape and include
`value`, `currency`, and `items`. The `purchase` event also includes
`transaction_id` for deduplication.

## GA4 Admin setup

The repository cannot apply GA4 property settings. Verify these settings in the
GA4 Admin interface:

1. Mark `purchase` as a key event. Consider
   `download_appinstaller_click` as the primary trial-intent key event.
2. Do not mark every CTA as a key event; retain them as funnel diagnostics.
3. Register event-scoped custom dimensions for:
   - `analytics_label`
   - `analytics_location`
   - `comparison_product`
   - `staff_count`
   - `comparison_years`
   - `section_id`
   - `percent_scrolled`
   - `purchase_kind`
   - `sku`
   - `launch_source`
4. Enable the desired Enhanced Measurement options. The site already emits its
   own milestone-based `page_scroll` events.
5. Configure internal-traffic and developer-traffic filters.
6. Review data retention, unwanted referrals, Search Console linking, and
   optional BigQuery export.
7. Verify all events in Realtime and DebugView after choosing **Allow
   analytics** in the test browser.

## Known cross-system boundary

`download_appinstaller_click` measures a download attempt. Actual trial
activation is recorded separately by the desktop app as `TrialActivated` in
Application Insights. The installer cannot safely carry a browser GA identity
into the installed application, so those events are not joined.

If campaign-to-activation attribution becomes necessary, design it as a
privacy-reviewed cross-system contract rather than passing GA cookie identifiers
into the desktop app.

For the most reliable revenue reporting, a future backend change should send
confirmed Paddle webhook purchases to GA4 with Measurement Protocol. The current
client event waits for the GA callback (with a bounded timeout) before navigating
to the completion page.

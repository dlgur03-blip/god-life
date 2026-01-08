# God Life Maker - Manual Testing Checklist

## Test Environment
- **URL**: https://god-life-six.vercel.app
- **Test Date**: _______________
- **Tester**: _______________
- **Browser**: _______________
- **Device**: _______________

---

## 1. Authentication & Authorization

### 1.1 Login
- [ ] Google login button is visible on home page
- [ ] Clicking Google login redirects to Google OAuth
- [ ] Successful login redirects back to application
- [ ] User name/avatar displayed after login
- [ ] Session persists after page refresh

### 1.2 Logout
- [ ] Logout button is visible when logged in
- [ ] Clicking logout clears session
- [ ] Protected pages redirect to login after logout

### 1.3 Authorization
- [ ] Non-authenticated users cannot access protected pages
- [ ] Non-admin users see 403/access denied on admin pages
- [ ] Admin users can access admin dashboard

---

## 2. Destiny Navigator Module

### 2.1 Day View
- [ ] Current day is displayed by default
- [ ] 24-hour timeblock structure is visible
- [ ] Date navigation (previous/next) works correctly
- [ ] Clicking date picker shows calendar
- [ ] "Today" button navigates to current date

### 2.2 Timeblock Management
- [ ] Adding new timeblock works
- [ ] Editing timeblock title works
- [ ] Editing timeblock time range works
- [ ] Deleting timeblock shows confirmation
- [ ] Drag-to-reorder timeblocks works
- [ ] Resize handles adjust time ranges
- [ ] Minimum 5-minute duration enforced

### 2.3 Weekly Plan
- [ ] Weekly plan grid displays 7 days
- [ ] Current day is highlighted
- [ ] Week goal input accepts text
- [ ] Week goal saves on blur/debounce
- [ ] Daily goals can be edited

### 2.4 Templates
- [ ] "Save Template" button opens dialog
- [ ] Template name can be entered
- [ ] Saving template shows success message
- [ ] "Load Template" button opens dialog
- [ ] Template list displays saved templates
- [ ] Loading template applies timeblocks
- [ ] Delete template shows confirmation

---

## 3. Discipline Mastery Module

### 3.1 Rule Management
- [ ] Rule list displays existing rules
- [ ] "Add Rule" input is visible
- [ ] Adding new rule works (max 13 rules)
- [ ] Editing rule text works
- [ ] Deleting rule shows confirmation
- [ ] Rule order can be changed (if supported)

### 3.2 Daily Check
- [ ] Check buttons work for today's date
- [ ] Checked state is visually distinct
- [ ] Unchecking rule works
- [ ] Past dates show read-only state
- [ ] Future dates show locked state
- [ ] Progress indicator shows check count

### 3.3 Date Navigation
- [ ] Previous day navigation works
- [ ] Next day navigation works
- [ ] Calendar picker selects date
- [ ] Today button navigates to current date

---

## 4. Success Code Module

### 4.1 Project List
- [ ] Project list page loads correctly
- [ ] Existing projects are displayed
- [ ] Project cards show title and progress
- [ ] "New Project" button opens dialog

### 4.2 Project Creation
- [ ] Project creation dialog opens
- [ ] Project title is required
- [ ] Creating project shows success
- [ ] New project appears in list

### 4.3 Project Detail (10x10 Grid)
- [ ] Grid displays 100 cells (10x10)
- [ ] Empty cells are clickable
- [ ] Filled cells show content preview
- [ ] Cell numbers are displayed correctly

### 4.4 Entry Management
- [ ] Clicking cell opens entry editor
- [ ] Entry title can be edited
- [ ] Entry description can be edited
- [ ] Image upload works
- [ ] Image preview displays correctly
- [ ] Saving entry updates cell
- [ ] Delete entry shows confirmation

### 4.5 Image Features
- [ ] Image upload accepts valid formats (jpg, png, webp)
- [ ] Invalid file types show error
- [ ] Large files show error (>2MB)
- [ ] Image preview modal opens on click
- [ ] Modal can be closed

### 4.6 Project Deletion
- [ ] Delete project button is visible
- [ ] Clicking shows confirmation dialog
- [ ] Confirming deletes project
- [ ] Redirects to project list after deletion

---

## 5. Self Epistle Module

### 5.1 Letter Writing
- [ ] Today's epistle form is editable
- [ ] "To Yesterday" field accepts text
- [ ] "To Tomorrow" field accepts text
- [ ] Mood selector shows options
- [ ] Selecting mood updates UI
- [ ] Save button submits letter

### 5.2 Received Letter
- [ ] Yesterday's letter card is displayed (if exists)
- [ ] Letter content is readable
- [ ] Mood indicator shows correctly
- [ ] Sent date is displayed

### 5.3 Date Access Rules
- [ ] Today: Full edit access
- [ ] Tomorrow: Can write "To Tomorrow" only
- [ ] Past dates: Read-only view
- [ ] Future dates (>tomorrow): Blocked/locked

### 5.4 Date Navigation
- [ ] Previous day navigation works
- [ ] Next day navigation works
- [ ] Calendar picker selects date
- [ ] Today button navigates to current date

---

## 6. Bio Hacking Module

### 6.1 Post List
- [ ] Post list page loads correctly
- [ ] Post cards display title and excerpt
- [ ] Category filters work (if available)
- [ ] Pagination works (if available)

### 6.2 Post Detail
- [ ] Post content renders correctly
- [ ] Markdown formatting is preserved
- [ ] Images load correctly
- [ ] Navigation back to list works

### 6.3 Localization
- [ ] Korean (ko) content displays
- [ ] English (en) content displays
- [ ] Japanese (ja) content displays
- [ ] Fallback content shows for missing translations

---

## 7. Admin Module

### 7.1 Dashboard
- [ ] Stats cards display correctly
- [ ] User count is accurate
- [ ] Module statistics show
- [ ] Quick links to modules work

### 7.2 User Management
- [ ] User list displays all users
- [ ] User search works
- [ ] User details show correctly
- [ ] Delete user shows confirmation
- [ ] Cannot delete self

### 7.3 Bio Post Management
- [ ] Post list displays all posts
- [ ] Create new post form works
- [ ] Edit existing post works
- [ ] Delete post shows confirmation
- [ ] Multi-language editing works

### 7.4 Error Logs
- [ ] Error log list displays
- [ ] Error details are readable
- [ ] Filter by level works (if available)
- [ ] Clear old logs works (if available)

---

## 8. Cross-Cutting Concerns

### 8.1 Internationalization (i18n)
- [ ] Language switcher is visible
- [ ] Switching to Korean (ko) works
- [ ] Switching to English (en) works
- [ ] Switching to Japanese (ja) works
- [ ] All UI text translates correctly
- [ ] Date formats localize correctly

### 8.2 Responsive Design
- [ ] Mobile (375px): Layout adapts correctly
- [ ] Tablet (768px): Layout adapts correctly
- [ ] Desktop (1920px): Full layout displays
- [ ] Navigation works on all sizes
- [ ] Touch interactions work on mobile

### 8.3 Accessibility
- [ ] Tab navigation works correctly
- [ ] Focus states are visible
- [ ] Button labels are descriptive
- [ ] Form labels are present
- [ ] Color contrast is sufficient

### 8.4 Performance
- [ ] Initial page load is fast (<3s)
- [ ] Navigation is responsive
- [ ] Data saves without long delay
- [ ] Images load efficiently

### 8.5 Error Handling
- [ ] Invalid URLs show 404 page
- [ ] API errors show user-friendly messages
- [ ] Form validation errors are clear
- [ ] Network errors are handled gracefully

---

## 9. Browser Compatibility

### 9.1 Desktop Browsers
- [ ] Chrome (latest) - All features work
- [ ] Firefox (latest) - All features work
- [ ] Safari (latest) - All features work
- [ ] Edge (latest) - All features work

### 9.2 Mobile Browsers
- [ ] Chrome Android - All features work
- [ ] Safari iOS - All features work
- [ ] Samsung Internet - All features work

---

## 10. Security Testing

### 10.1 Authentication Security
- [ ] Direct URL to protected page redirects to login
- [ ] Session expires after inactivity
- [ ] Cannot access other users' data

### 10.2 Input Validation
- [ ] XSS attempts are blocked
- [ ] SQL injection attempts are blocked
- [ ] File upload validates file type
- [ ] File upload validates file size

---

## Notes

### Issues Found
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Suggestions
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

**Testing Completed**: [ ] Yes [ ] No
**Overall Status**: [ ] Pass [ ] Fail [ ] Partial
**Sign-off Date**: _______________

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New `classes` parameter to the `useCssHandle` hook.
- New `useCustomClasses` hook.
- New `CssHandlesContext` provider and hook.

### Changed
- `useCssHandles` now returns a bag of utilities (`handles`, `withModifiers` for now).

### Changed
- Refactor CSS Handle name normalization and validation to a more performant method.

## [0.4.4] - 2020-08-31
### Changed
- Modifier errors are only displayed on dev workspaces.

## [0.4.3] - 2020-08-31
### Changed
- Groups modifier errors into a single log.

## [0.4.2] - 2020-03-02
### Fixed
- Allow `-` on css handles.

## [0.4.1] - 2019-10-28
### Chore
- New release to trigger a rebuild enabling lazy evaluation of css-handles entrypoints

## [0.4.0] - 2019-10-08
### Added
- `withCssHandles` higher order component.

## [0.3.2] - 2019-10-07
### Fixed
- Erase extra space when invalid modifier was filtered.

## [0.3.1] - 2019-10-04
### Fixed
- Also allow `-` on handle modfifiers.

## [0.3.0] - 2019-10-03
### Added
- `migrationFrom` option.

## [0.2.1] - 2019-10-03
### Changed
- Validates modifiers

## [0.2.0] - 2019-10-02
### Added
- applyModifiers helper

## [0.1.0] - 2019-10-02

### Added
- Intial release.

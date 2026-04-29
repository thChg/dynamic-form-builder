#!/bin/sh
set -e

rm -fr ./gateway/helpers
rm -fr ./mainService/helpers
rm -fr ./authService/helpers

ln -s ../helpers ./gateway/helpers
ln -s ../helpers ./mainService/helpers
ln -s ../helpers ./authService/helpers

rm -fr ./gateway/constants
rm -fr ./mainService/constants
rm -fr ./authService/constants

ln -s ../constants ./gateway/constants
ln -s ../constants ./mainService/constants
ln -s ../constants ./authService/constants


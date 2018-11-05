cmake_minimum_required(VERSION 3.0)
project(node-flock CXX)
set(CMAKE_CXX_STANDARD 11)

add_library(node-flock MODULE flock.cc)
if (CMAKE_INCLUDE_DIR)
  target_include_directories(node-flock PRIVATE
    ${CMAKE_INCLUDE_DIR}
    ${CMAKE_INCLUDE_DIR}/shadow-node
    # the following needs to be moved to CMAKE_SYSROOT
    ${CMAKE_INCLUDE_DIR}/include
    ${CMAKE_INCLUDE_DIR}/usr/include
    ${CMAKE_INCLUDE_DIR}/usr/include/shadow-node
  )
endif()

target_link_libraries(node-flock iotjs)
set_target_properties(node-flock PROPERTIES
  PREFIX ""
  SUFFIX ".node"
  OUTPUT_NAME "flock"
  LINK_FLAGS "-rdynamic")

if (CMAKE_INSTALL_DIR)
  install(TARGETS node-flock DESTINATION ${CMAKE_INSTALL_DIR})
  install(FILES index.js DESTINATION ${CMAKE_INSTALL_DIR})
endif()

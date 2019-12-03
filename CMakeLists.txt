cmake_minimum_required(VERSION 3.6)
project(flock CXX)
set(CMAKE_CXX_STANDARD 11)

add_library(${PROJECT_NAME} MODULE flock.cc)
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

if(APPLE)
  set_target_properties(${PROJECT_NAME} PROPERTIES
                        LINK_FLAGS "-rdynamic -undefined dynamic_lookup")
else()
  set_target_properties(${PROJECT_NAME} PROPERTIES
                        LINK_FLAGS "-rdynamic -Wl,--unresolved-symbols=ignore-all")
endif()

if (CMAKE_INCLUDE_DIR)
  target_include_directories(${PROJECT_NAME} PRIVATE
    ${CMAKE_INCLUDE_DIR}/include
    ${CMAKE_INCLUDE_DIR}/usr/include
    ${CMAKE_INCLUDE_DIR}/usr/include/shadow-node
  )
endif()

if (CMAKE_INSTALL_DIR)
  install(TARGETS node-flock DESTINATION ${CMAKE_INSTALL_DIR})
  install(FILES index.js DESTINATION ${CMAKE_INSTALL_DIR})
endif()

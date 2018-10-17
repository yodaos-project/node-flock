{
  "targets": [
    {
      "target_name": "flock",
      "sources": [
        "flock.cc",
      ],
      "cflags_cc!": [
        "-std=c++11",
        "-stdlib=libc++",
      ]
    }
  ]
}

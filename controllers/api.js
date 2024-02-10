import Student from "../models/students.js";
import PowerData from "../models/power.js";

export async function Add(req, res) {
  console.log(req.body)
  const { name, admission_no, student_class, year, reasons } = req.body;
  const captured_date_format = new Date();

  try {
  const edited_reasons = reasons.map(data => {
    return {
      name: data.name,
      resolved: false,
      captured_date: captured_date_format
    }
  })
    
    const newStudent = new Student({
      name,
      admission_no,
      student_class,
      year,
      reasons: edited_reasons,
    });

    const savedStudent = await newStudent.save();
    const { ...user_data } = savedStudent._doc;
    res.status(200).json({
      status: "success",
      data: [user_data],
      message: "Student Added Successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: err,
    });
  }
  res.end();
}

export async function Search(req, res) {
  const { page = "", page_size = "", search = "" } = req.query;

  try {
    const query = {
      $or: [{ name: { $regex: new RegExp(search, "i") } }],
    };

    const total_count = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * page_size)
      .limit(page_size);

    if (!students) {
      return res.status(400).json({
        status: "failed",
        data: [],
        message: "Students data cannot be fetched at this time",
      });
    }

    res.status(200).json({
      status: "success",
      data: { students, total_count },
      message: "Students Fetch Successful",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: err,
    });
  }
  res.end();
}

export async function Delete(req, res) {
  const { id } = req.params;

  try {
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(400).json({
        status: "failed",
        data: [],
        message: "Student data cannot be fetched at this time",
      });
    }

    res.status(200).json({
      status: "success",
      data: [],
      message: "Student Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: err,
    });
  }
  res.end();
}

export async function Edit(req, res) {
  const id = req.params.id;
  const { name, admission_no, student_class, year } = req.body;

  try {
    const student = await Student.findById(id);

    if (!student) {
      return res.status(400).json({
        status: "failed",
        data: [],
        message: "Student data cannot be fetched at this time",
      });
    }

    await Student.updateOne(
      { _id: id },
      {
        name: name,
        admission_no: admission_no,
        student_class: student_class,
        year: year,
      }
    );

    res.status(200).json({
      status: "success",
      data: [],
      message: "Student Edited Successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: err,
    });
  }
  res.end();
}

export async function AddReason(req, res) {
  const id = req.params.id;

  try {
    const student = await Student.findById(id);

    if (!student) {
      return res.status(400).json({
        status: "failed",
        data: [],
        message: "Student data cannot be fetched at this time",
      });
    }

    const content = req.body

    Student.findById(id)
          .then((student) => {
            content.forEach(data => {
              student.reasons.push(data);
            })
            student
              .save()
              .then(() => {
                return "Success";
              })
              .catch(console.log);
          })
          .catch(console.log);

    res.status(200).json({
      status: "success",
      data: [],
      message: "Student Issue Added Successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: err,
    });
  }
  res.end();
}

export async function Resolve(req, res) {
  const id = req.params.id;
  const reason = req.params.reason;
  const { reasons } = req.body;

  try {
    const student = await Student.findById(id);

    if (!student) {
      return res.status(400).json({
        status: "failed",
        data: [],
        message: "Student data cannot be fetched at this time",
      });
    }

    const filteredData = student.reasons.filter((data) => {
      return data._id == reason;
    });

    if (filteredData.length === 0) {
      return res.status(400).json({
        status: "failed",
        data: [],
        message: "Reason data cannot be found",
      });
    }

    await Student.updateOne(
      { _id: id, "reasons._id": filteredData[0]._id },
      {
        $set: {
          "reasons.$.name": reasons[0].name,
          "reasons.$.resolved": reasons[0].resolved,
        },
      }
    );

    res.status(200).json({
      status: "success",
      data: [],
      message: "Student Issue Resolved Successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: err,
    });
  }
  res.end();
}

export async function Power(req, res) {

  try {
    await PowerData.updateOne(
      { _id: "65216c72dce0a680475a124c" },
      {
        system_off: req.body.system_off
      }
    );

    res.status(200).json({
      status: "success",
      data: [],
      message: "System Shutdown Completed!",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: err,
    });
  }
  res.end();
}